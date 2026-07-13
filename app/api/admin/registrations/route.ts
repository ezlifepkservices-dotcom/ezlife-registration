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

type ExistingMemberRecord = {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  email: string;
  referral_code: string;
  status: string;
};

function getEnvironment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    throw new Error("Required server environment variables are missing.");
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey,
  };
}

function getAccessToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
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

async function verifyAdmin(request: NextRequest) {
  const { supabaseUrl, supabaseAnonKey } = getEnvironment();
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return {
      authorized: false as const,
      message: "Authentication token missing.",
    };
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser(accessToken);

  if (userError || !user) {
    return {
      authorized: false as const,
      message: "Invalid or expired admin session.",
    };
  }

  const supabaseAdmin = createAdminClient();

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role, status")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      authorized: false as const,
      message: "Admin profile was not found.",
    };
  }

  const hasAdminRole =
    profile.role === "admin" || profile.role === "super_admin";

  if (!hasAdminRole) {
    return {
      authorized: false as const,
      message: "You are not authorized to access this module.",
    };
  }

  if (profile.status !== "active") {
    return {
      authorized: false as const,
      message: "Your admin account is not active.",
    };
  }

  return {
    authorized: true as const,
    user,
  };
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

async function createOrUpdateMemberProfile({
  authUserId,
  memberId,
  fullName,
  email,
}: {
  authUserId: string;
  memberId: string;
  fullName: string;
  email: string;
}) {
  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin.from("profiles").upsert(
    {
      auth_user_id: authUserId,
      member_id: memberId,
      full_name: fullName,
      email: email.trim().toLowerCase(),
      role: "member",
      status: "active",
      must_change_password: true,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "auth_user_id",
    },
  );

  if (error) {
    throw new Error(`Member profile could not be created: ${error.message}`);
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminVerification = await verifyAdmin(request);

    if (!adminVerification.authorized) {
      return NextResponse.json(
        {
          error: adminVerification.message,
        },
        {
          status: 401,
        },
      );
    }

    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from("registrations")
      .select(
        "id, full_name, mobile, whatsapp, email, city, interested_service, referred_by, status, created_at",
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      registrations: data ?? [],
    });
  } catch (error) {
    console.error("Admin registrations GET error:", error);

    return NextResponse.json(
      {
        error: "Unable to load registrations.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  let createdAuthUserId: string | null = null;
  let createdMemberId: string | null = null;
  let createdProfile = false;

  try {
    const adminVerification = await verifyAdmin(request);

    if (!adminVerification.authorized) {
      return NextResponse.json(
        {
          error: adminVerification.message,
        },
        {
          status: 401,
        },
      );
    }

    const body = (await request.json()) as {
      registrationId?: string;
    };

    if (!body.registrationId) {
      return NextResponse.json(
        {
          error: "Registration ID is required.",
        },
        {
          status: 400,
        },
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
        {
          error: "Registration record not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (registration.status.toLowerCase() === "approved") {
      return NextResponse.json(
        {
          error: "This registration is already approved.",
        },
        {
          status: 409,
        },
      );
    }

    const normalizedEmail = registration.email.trim().toLowerCase();

    const { data: existingMemberData, error: existingMemberError } =
      await supabaseAdmin
        .from("members")
        .select(
          "id, auth_user_id, full_name, email, referral_code, status",
        )
        .ilike("email", normalizedEmail)
        .maybeSingle<ExistingMemberRecord>();

    if (existingMemberError) {
      return NextResponse.json(
        {
          error: existingMemberError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (existingMemberData) {
      if (!existingMemberData.auth_user_id) {
        return NextResponse.json(
          {
            error:
              "Existing member does not have an authentication account. Please contact system administrator.",
          },
          {
            status: 409,
          },
        );
      }

      await createOrUpdateMemberProfile({
        authUserId: existingMemberData.auth_user_id,
        memberId: existingMemberData.id,
        fullName: existingMemberData.full_name,
        email: existingMemberData.email,
      });

      const { error: registrationStatusError } = await supabaseAdmin
        .from("registrations")
        .update({
          status: "Approved",
        })
        .eq("id", registration.id);

      if (registrationStatusError) {
        return NextResponse.json(
          {
            error: registrationStatusError.message,
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json({
        message: "Existing member registration approved.",
        memberId: existingMemberData.id,
        referralCode: existingMemberData.referral_code,
        credentialsDelivery: "pending",
        temporaryPassword:
          process.env.NODE_ENV === "development" ? null : undefined,
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
        {
          status: 400,
        },
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
        {
          status: 500,
        },
      );
    }

    createdMemberId = member.id;

    await createOrUpdateMemberProfile({
      authUserId: authResult.user.id,
      memberId: member.id,
      fullName: registration.full_name,
      email: normalizedEmail,
    });

    createdProfile = true;

    const { error: registrationStatusError } = await supabaseAdmin
      .from("registrations")
      .update({
        status: "Approved",
      })
      .eq("id", registration.id);

    if (registrationStatusError) {
      await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("auth_user_id", authResult.user.id);

      await supabaseAdmin.from("members").delete().eq("id", member.id);

      await supabaseAdmin.auth.admin.deleteUser(authResult.user.id);

      return NextResponse.json(
        {
          error: registrationStatusError.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      message: "Registration approved successfully.",
      memberId: member.id,
      referralCode: member.referral_code,
      credentialsDelivery: "pending",
      temporaryPassword:
        process.env.NODE_ENV === "development"
          ? temporaryPassword
          : undefined,
    });
  } catch (error) {
    console.error("Admin approval POST error:", error);

    try {
      const supabaseAdmin = createAdminClient();

      if (createdProfile && createdAuthUserId) {
        await supabaseAdmin
          .from("profiles")
          .delete()
          .eq("auth_user_id", createdAuthUserId);
      }

      if (createdMemberId) {
        await supabaseAdmin
          .from("members")
          .delete()
          .eq("id", createdMemberId);
      }

      if (createdAuthUserId) {
        await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId);
      }
    } catch (rollbackError) {
      console.error("Approval rollback error:", rollbackError);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Registration approval failed.",
      },
      {
        status: 500,
      },
    );
  }
}