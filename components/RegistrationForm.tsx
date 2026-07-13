"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Send,
  Smartphone,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { cities } from "@/lib/cities";
import { services } from "@/lib/services";
import { supabase } from "@/lib/supabase";
import {
  registrationSchema,
  type RegistrationForm,
} from "@/lib/validation";

export default function RegistrationFormComponent() {
  const searchParams = useSearchParams();
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      full_name: "",
      mobile: "",
      whatsapp: "",
      email: "",
      city: "",
      interested_service: [],
      referral_code: "",
      consent: false,
    },
  });

  const mobile = watch("mobile");
  const referralFromUrl = searchParams.get("ref")?.trim().toUpperCase() ?? "";
  const defaultReferralCode = referralFromUrl || "EZADMIN";

  useEffect(() => {
    setValue("referral_code", defaultReferralCode, {
      shouldValidate: true,
    });
  }, [defaultReferralCode, setValue]);

  const ensureReferralCode = () => {
    const currentReferralCode = getValues("referral_code")?.trim();

    if (!currentReferralCode) {
      setValue("referral_code", defaultReferralCode, {
        shouldValidate: true,
      });
    }
  };

  useEffect(() => {
    if (sameAsMobile) {
      setValue("whatsapp", mobile ?? "", {
        shouldValidate: true,
      });
    }
  }, [mobile, sameAsMobile, setValue]);

  const rollbackRegistration = async (registrationId: string) => {
    await supabase
      .from("registration_services")
      .delete()
      .eq("registration_id", registrationId);

    await supabase
      .from("registrations")
      .delete()
      .eq("id", registrationId);
  };

  const onSubmit = async (data: RegistrationForm) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setIsSubmitted(false);

    let registrationId: string | null = null;

    try {
      const referralCode = data.referral_code.trim().toUpperCase();
      const normalizedEmail = data.email.trim().toLowerCase();

      const selectedServices = data.interested_service.filter((service) =>
        service.trim().toLowerCase().includes("umrah"),
      );

      if (selectedServices.length === 0) {
        toast.error("Please select the Umrah service.");
        return;
      }

      const { data: referralMatches, error: referralError } =
        await supabase.rpc("validate_referral_code", {
          input_code: referralCode,
        });

      const referringMember = referralMatches?.[0] ?? null;

      if (referralError) {
        toast.error(
          `Referral code verify nahi ho saka: ${referralError.message}`,
        );
        return;
      }

      if (!referringMember) {
        toast.error("Invalid referral code.");
        return;
      }

      const { data: existingRegistration, error: existingError } =
        await supabase
          .from("registrations")
          .select("id, status")
          .ilike("email", normalizedEmail)
          .maybeSingle();

      if (existingError) {
        toast.error(existingError.message);
        return;
      }

      if (existingRegistration) {
        toast.error(
          `Is email se registration pehle se maujood hai. Status: ${existingRegistration.status}`,
        );
        return;
      }

      const { data: registration, error: registrationError } =
        await supabase
          .from("registrations")
          .insert({
            full_name: data.full_name.trim(),
            mobile: data.mobile.trim(),
            whatsapp: data.whatsapp.trim(),
            email: normalizedEmail,
            city: data.city,
            interested_service: selectedServices.join(", "),
            referred_by: referralCode,
            status: "Pending",
          })
          .select("id")
          .single();

      if (registrationError || !registration) {
        toast.error(
          registrationError?.message ??
            "Registration save nahi ho saki.",
        );
        return;
      }

      registrationId = registration.id;

      const { data: serviceRecords, error: serviceError } =
        await supabase
          .from("services")
          .select("id, name")
          .in("name", selectedServices);

      if (serviceError) {
        await rollbackRegistration(registration.id);

        toast.error(
          `Services load nahi ho sakin: ${serviceError.message}`,
        );
        return;
      }

      if (!serviceRecords || serviceRecords.length === 0) {
        await rollbackRegistration(registration.id);

        toast.error("Umrah service database mein available nahi hai.");
        return;
      }

      const serviceLinks = serviceRecords.map((service) => ({
        registration_id: registration.id,
        service_id: service.id,
      }));

      const { error: linkError } = await supabase
        .from("registration_services")
        .insert(serviceLinks);

      if (linkError) {
        await rollbackRegistration(registration.id);

        toast.error(
          `Selected service save nahi hui: ${linkError.message}`,
        );
        return;
      }

      toast.success(
        "Registration successfully submit ho gayi. Admin approval ka intezar karein.",
      );

      setIsSubmitted(true);
      setSameAsMobile(false);

      reset({
        full_name: "",
        mobile: "",
        whatsapp: "",
        email: "",
        city: "",
        interested_service: [],
        referral_code: "",
        consent: false,
      });
    } catch (error) {
      console.error("Registration error:", error);

      if (registrationId) {
        await rollbackRegistration(registrationId);
      }

      toast.error(
        "Registration ke dauran unexpected error aa gaya. Dobara try karein.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputWithIconClassName =
    "h-14 w-full rounded-2xl border border-white/10 bg-white/[0.045] pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-violet-500/10";

  const errorClassName = "mt-2 text-sm font-medium text-red-400";

  return (
    <div className="w-full rounded-[2rem] border border-white/10 bg-[#111C35]/95 p-5 text-white shadow-[0_30px_100px_rgba(2,6,23,0.45)] backdrop-blur-2xl sm:p-8 lg:p-10">
      <div className="border-b border-white/10 pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
          Application Form
        </p>

        <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          EZ Life Registration
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-slate-400">
          Please enter accurate information. Your application will remain
          pending until reviewed by the EZ Life administration team.
        </p>
      </div>

      {isSubmitted && (
        <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={22}
              className="mt-0.5 shrink-0 text-emerald-300"
            />

            <div>
              <p className="font-black text-emerald-300">
                Registration Submitted
              </p>

              <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                Your application has been received and is now pending
                administrative approval.
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-7"
      >
        <div>
          <label
            htmlFor="full_name"
            className="mb-2 block text-sm font-bold text-slate-200"
          >
            Full Name
          </label>

          <div className="relative">
            <UserRound
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="full_name"
              {...register("full_name")}
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              className={inputWithIconClassName}
            />
          </div>

          {errors.full_name && (
            <p className={errorClassName}>
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="mobile"
              className="mb-2 block text-sm font-bold text-slate-200"
            >
              Mobile Number
            </label>

            <div className="relative">
              <Phone
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="mobile"
                {...register("mobile")}
                type="tel"
                inputMode="numeric"
                maxLength={11}
                placeholder="03XXXXXXXXX"
                autoComplete="tel"
                className={inputWithIconClassName}
              />
            </div>

            {errors.mobile && (
              <p className={errorClassName}>
                {errors.mobile.message}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="whatsapp"
                className="block text-sm font-bold text-slate-200"
              >
                WhatsApp Number
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-violet-300">
                <input
                  type="checkbox"
                  checked={sameAsMobile}
                  onChange={(event) => {
                    const checked = event.target.checked;

                    setSameAsMobile(checked);

                    if (checked) {
                      setValue("whatsapp", mobile ?? "", {
                        shouldValidate: true,
                      });
                    }
                  }}
                  className="h-4 w-4 accent-[#6D3BFF]"
                />

                Same as mobile
              </label>
            </div>

            <div className="relative">
              <Smartphone
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="whatsapp"
                {...register("whatsapp")}
                type="tel"
                inputMode="numeric"
                maxLength={11}
                placeholder="03XXXXXXXXX"
                autoComplete="tel"
                readOnly={sameAsMobile}
                className={`${inputWithIconClassName} ${
                  sameAsMobile ? "cursor-not-allowed opacity-70" : ""
                }`}
              />
            </div>

            {errors.whatsapp && (
              <p className={errorClassName}>
                {errors.whatsapp.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold text-slate-200"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="email"
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              onFocus={ensureReferralCode}
              className={inputWithIconClassName}
            />
          </div>

          {errors.email && (
            <p className={errorClassName}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-bold text-slate-200"
          >
            City
          </label>

          <div className="relative">
            <MapPin
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
            />

            <select
              id="city"
              {...register("city")}
              className={`${inputWithIconClassName} appearance-none`}
            >
              <option value="" className="bg-[#111C35]">
                Select your city
              </option>

              {cities.map((city) => (
                <option
                  key={city}
                  value={city}
                  className="bg-[#111C35]"
                >
                  {city}
                </option>
              ))}
            </select>
          </div>

          {errors.city && (
            <p className={errorClassName}>{errors.city.message}</p>
          )}
        </div>

        <div>
          <div className="mb-3">
            <p className="text-sm font-bold text-slate-200">
              Interested Services
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Currently, only the Umrah service is available for registration.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => {
              const isUmrahService = service
                .trim()
                .toLowerCase()
                .includes("umrah");

              return (
                <label
                  key={service}
                  className={`relative flex items-center gap-3 rounded-2xl border p-4 text-sm font-semibold transition ${
                    isUmrahService
                      ? "cursor-pointer border-violet-400/30 bg-violet-400/10 text-white hover:border-violet-400/60"
                      : "cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600 opacity-60"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={service}
                    disabled={!isUmrahService}
                    {...register("interested_service")}
                    className="h-4 w-4 shrink-0 accent-[#6D3BFF] disabled:cursor-not-allowed"
                  />

                  <Building2
                    size={18}
                    className={
                      isUmrahService
                        ? "shrink-0 text-violet-300"
                        : "shrink-0 text-slate-600"
                    }
                  />

                  <span className="flex-1">{service}</span>

                  {!isUmrahService && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Coming Soon
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {errors.interested_service && (
            <p className={errorClassName}>
              {errors.interested_service.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="referral_code"
            className="mb-2 block text-sm font-bold text-slate-200"
          >
            Referral Code
          </label>

          <div className="relative">
            <UsersRound
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              id="referral_code"
              {...register("referral_code")}
              type="text"
              placeholder="Referral code"
              autoComplete="off"
              readOnly
              aria-readonly="true"
              className={`${inputWithIconClassName} cursor-not-allowed uppercase opacity-80`}
            />

            <LockKeyhole
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-violet-300"
            />
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Referral code is locked. Direct registrations use EZADMIN, while
            referral links automatically use the referring member&apos;s code.
          </p>

          {errors.referral_code && (
            <p className={errorClassName}>
              {errors.referral_code.message}
            </p>
          )}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <input
              type="checkbox"
              {...register("consent")}
              className="mt-1 h-4 w-4 shrink-0 accent-[#6D3BFF]"
            />

            <span className="text-sm leading-6 text-slate-300">
              I confirm that the information provided is accurate and I
              understand that my application is subject to administrative
              review and approval.
            </span>
          </label>

          {errors.consent && (
            <p className={errorClassName}>
              {errors.consent.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#6D3BFF] to-[#8C5CFF] px-6 text-base font-black text-white shadow-[0_18px_50px_rgba(109,59,255,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(109,59,255,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <LoaderCircle size={20} className="animate-spin" />
          ) : (
            <Send size={19} />
          )}

          {isSubmitting
            ? "Submitting Registration..."
            : "Submit Registration"}
        </button>

        <p className="text-center text-xs leading-5 text-slate-500">
          Your information will be stored securely and used only for EZ
          Life membership processing.
        </p>
      </form>
    </div>
  );
}