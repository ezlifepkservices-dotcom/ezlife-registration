"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registrationSchema,
  RegistrationForm,
} from "@/lib/validation";

import { cities } from "@/lib/cities";
import { services } from "@/lib/services";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function RegistrationFormComponent() {
  const [sameAsMobile, setSameAsMobile] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  const mobile = watch("mobile");

const onSubmit = async (data: RegistrationForm) => {
  try {
    // Check Referral Code
    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("referral_code", data.referral_code.toUpperCase())
      .maybeSingle();

    if (!member) {
      toast.error("Invalid Referral Code");
      return;
    }

    // Save Registration
    const { data: registration, error: registrationError } =
      await supabase
        .from("registrations")
        .insert({
          full_name: data.full_name,
          mobile: data.mobile,
          whatsapp: data.whatsapp,
          email: data.email,
          city: data.city,
          referred_by: data.referral_code.toUpperCase(),
          status: "Pending",
        })
        .select()
        .single();

    if (registrationError) {
      toast.error(registrationError.message);
      return;
    }


    // Get IDs for selected services
    const serviceIds: string[] = [];

    for (const serviceName of data.interested_service) {
      const { data: service, error: serviceError } = await supabase
        .from("services")
        .select("id")
        .eq("name", serviceName)
        .single();



      if (serviceError || !service) {
        console.error("SERVICE NOT FOUND:", serviceName);
        continue;
      }

      serviceIds.push(service.id);
    }

if (serviceIds.length === 0) {
  toast.error("No valid services selected.");
  return;
}

    // Insert all links in one go
    const rows = serviceIds.map((service_id) => ({
      registration_id: registration.id,
      service_id,
    }));



    const { data: linkData, error: linkError } = await supabase
      .from("registration_services")
      .insert(rows)
      .select();


    if (linkError) {
      toast.error("Services save nahi hue: " + linkError.message);
      return;
    }

    toast.success("Registration successful!");
  } catch (err) {
    console.error("UNEXPECTED ERROR:", err);
    toast.error("Kuch ghalat ho gaya. Dobara try karein.");
  }
};

 return (
    <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 text-white">
      <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
  EZ LIFE Registration
</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Full Name */}
        <div>
          <label className="border border-slate-700 bg-slate-800 rounded-xl p-3 flex gap-2 items-center hover:border-violet-500">
            Full Name
          </label>

          <input
            {...register("full_name")}
            type="text"
            placeholder="Enter your full name"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-400 focus:border-violet-500 focus:outline-none"
          />

          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">
              Enter your full name
            </p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="border border-slate-700 bg-slate-800 rounded-xl p-3 flex gap-2 items-center hover:border-violet-500">
            Mobile Number
          </label>

          <input
            {...register("mobile")}
            type="text"
            maxLength={11}
            placeholder="03XXXXXXXXX"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-400 focus:border-violet-500 focus:outline-none"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">
              WhatsApp Number
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sameAsMobile}
                onChange={(e) => {
                  setSameAsMobile(e.target.checked);

                  if (e.target.checked) {
                    setValue("whatsapp", mobile);
                  }
                }}
              />

              Same as Mobile
            </label>
          </div>

          <input
            {...register("whatsapp")}
            type="text"
            maxLength={11}
            placeholder="03XXXXXXXXX"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-400 focus:border-violet-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="border border-slate-700 bg-slate-800 rounded-xl p-3 flex gap-2 items-center hover:border-violet-500">
            Email Address
          </label>

          <input
            {...register("email")}
            type="email"
            placeholder="name@email.com"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-400 focus:border-violet-500 focus:outline-none"
          />
        </div>

        {/* City */}
        <div>
          <label className="border border-slate-700 bg-slate-800 rounded-xl p-3 flex gap-2 items-center hover:border-violet-500">
            City
          </label>

          <select
            {...register("city")}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-400 focus:border-violet-500 focus:outline-none"
          >
            <option value="">
              Select City
            </option>

            {cities.map((city) => (
              <option
                key={city}
                value={city}
              >
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Interested Service */}
        <div>
          <label className="border border-slate-700 bg-slate-800 rounded-xl p-3 flex gap-2 items-center hover:border-violet-500">
            Interested Service
          </label>

          <div className="grid grid-cols-2 gap-3">
            {services.map((service) => (
              <label
                key={service}
                className="border rounded-xl p-3 flex gap-2 items-center"
              >
                <input
                  type="checkbox"
                  value={service}
                  {...register("interested_service")}
                />

                {service}
              </label>
            ))}
          </div>
        </div>

        {/* Referral */}
        <div>
          <label className="border border-slate-700 bg-slate-800 rounded-xl p-3 flex gap-2 items-center hover:border-violet-500">
            Referral Code
          </label>

          <input
            {...register("referral_code")}
            type="text"
            placeholder="Enter Referral Code"
            className="w-full border rounded-xl p-3 uppercase"
          />

          <p className="text-xs text-gray-500 mt-2">
            Please obtain your referral code from the person
            who referred you or from EZ Life support.
          </p>
        </div>

        {/* Consent */}
        <label className="flex gap-3 items-start">
          <input
            type="checkbox"
            {...register("consent")}
          />

          <span>
            I confirm that the information provided is
            accurate.
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl p-4 font-semibold transition"
        >
          Register Now
        </button>
      </form>
    </div>
  );
}