import { createClient } from "@supabase/supabase-js";
import { randomBytes, randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RegistrationRecord = {
  id: string;
  full_name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  city: string;
  interested_service: string | null;
  referred_by: string | null;
  status: string;
  created_at: string;
};

function getEnvironment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    !serviceRoleKey ||
    !adminEmail
  ) {
    throw new Error("Required server environment variables are missing.");
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey,
    adminEmail,
  };
}

function getAccessToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

async function verifyAdmin(request: NextRequest) {
  const {
    supabaseUrl,
    supabaseAnonKey,
    adminEmail,
  } = getEnvironment();

  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return {
      authorized: false as const,
      message: "Authentication token missing.",
    };
  }

  const authClient = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const {
    data: { user },
    error,
  } = await authClient.auth.getUser(accessToken);

  if (error || !user?.email) {
    return {
      authorized: false as const,
      message: "Invalid or expired admin session.",
    };
  }

  if (user.email.trim().toLowerCase() !== adminEmail) {
    return {
      authorized: false as const,
      message: "You are not authorized to access this module.",
    };
  }

  return {
    authorized: true as const,
    user,
  };
}

function createAdminClient() {
  const { supabaseUrl, serviceRoleKey } = getEnvironment();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function generateTemporaryPassword() {
  return `Ez@${randomBytes(8).toString("hex")}9`;
}

function generateReferralCode() {
  return `EZ${randomUUID()
    .replaceAll("-", "")
    .slice(0, 8)
    .toUpperCase()}`;
}

export async function GET(request: NextRequest) {
  try {
    const adminVerification = await verifyAdmin(request);

    if (!adminVerification.authorized) {
      return NextResponse.json(
        { error: adminVerification.message },
        { status: 401 },
      );
    }

    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from("registrations")
      .select(
        "id, full_name, mobile, whatsapp, email, city, interested_service, referred_by, status, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      registrations: data ?? [],
    });
  } catch (error) {
    console.error("Admin registrations GET error:", error);

    return NextResponse.json(
      { error: "Unable to load registrations." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  let createdAuthUserId: string | null = null;
  let createdMemberId: string | null = null;

  try {
    const adminVerification = await verifyAdmin(request);

    if (!adminVerification.authorized) {
      return NextResponse.json(
        { error: adminVerification.message },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      registrationId?: string;
    };

    if (!body.registrationId) {
      return NextResponse.json(
        { error: "Registration ID is required." },
        { status: 400 },
      );
    }

    const supabaseAdmin = createAdminClient();

    const { data: registration, error: registrationError } =
      await supabaseAdmin
        .from("registrations")
        .select(
          "id, full_name, mobile, whatsapp, email, city, interested_service, referred_by, status, created_at",
        )
        .eq("id", body.registrationId)
        .single<RegistrationRecord>();

    if (registrationError || !registration) {
      return NextResponse.json(
        { error: "Registration record not found." },
        { status: 404 },
      );
    }

    if (registration.status.toLowerCase() === "approved") {
      return NextResponse.json(
        { error: "This registration is already approved." },
        { status: 409 },
      );
    }

    const normalizedEmail = registration.email.trim().toLowerCase();

    const { data: existingMember } = await supabaseAdmin
      .from("members")
      .select("id, referral_code, status")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (existingMember) {
      const { error: statusUpdateError } = await supabaseAdmin
        .from("registrations")
        .update({ status: "Approved" })
        .eq("id", registration.id);

      if (statusUpdateError) {
        return NextResponse.json(
          { error: statusUpdateError.message },
          { status: 500 },
        );
      }

      return NextResponse.json({
        message: "Existing member registration approved.",
        memberId: existingMember.id,
        referralCode: existingMember.referral_code,
        temporaryPassword: null,
      });
    }

    const temporaryPassword = generateTemporaryPassword();
    const referralCode = generateReferralCode();

    const { data: authResult, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: {
          full_name: registration.full_name,
          role: "member",
        },
      });

    if (authError || !authResult.user) {
      return NextResponse.json(
        {
          error:
            authError?.message ??
            "Member authentication account could not be created.",
        },
        { status: 400 },
      );
    }

    createdAuthUserId = authResult.user.id;

    const { data: member, error: memberError } = await supabaseAdmin
      .from("members")
      .insert({
        auth_user_id: authResult.user.id,
        full_name: registration.full_name,
        mobile: registration.mobile,
        whatsapp: registration.whatsapp,
        email: normalizedEmail,
        city: registration.city,
        referral_code: referralCode,
        status: "Active",
      })
      .select("id, referral_code")
      .single();

    if (memberError || !member) {
      await supabaseAdmin.auth.admin.deleteUser(authResult.user.id);

      return NextResponse.json(
        {
          error:
            memberError?.message ??
            "Member database record could not be created.",
        },
        { status: 500 },
      );
    }

    createdMemberId = member.id;

    const { error: statusUpdateError } = await supabaseAdmin
      .from("registrations")
      .update({ status: "Approved" })
      .eq("id", registration.id);

    if (statusUpdateError) {
      await supabaseAdmin
        .from("members")
        .delete()
        .eq("id", member.id);

      await supabaseAdmin.auth.admin.deleteUser(authResult.user.id);

      return NextResponse.json(
        { error: statusUpdateError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Registration approved successfully.",
      memberId: member.id,
      referralCode: member.referral_code,
      temporaryPassword,
    });
  } catch (error) {
    console.error("Admin approval POST error:", error);

    try {
      const supabaseAdmin = createAdminClient();

      if (createdMemberId) {
        await supabaseAdmin
          .from("members")
          .delete()
          .eq("id", createdMemberId);
      }

      if (createdAuthUserId) {
        await supabaseAdmin.auth.admin.deleteUser(
          createdAuthUserId,
        );
      }
    } catch (rollbackError) {
      console.error("Approval rollback error:", rollbackError);
    }

    return NextResponse.json(
      { error: "Registration approval failed." },
      { status: 500 },
    );
  }
}