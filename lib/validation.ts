import { z } from "zod";

export const registrationSchema = z.object({
  full_name: z.string().min(3),
  mobile: z.string().min(11).max(11),
  whatsapp: z.string().min(11).max(11),
  email: z.string().email(),
  city: z.string().min(1),
  interested_service: z.array(z.string()).min(1),
  referral_code: z.string().min(3),
  consent: z.boolean().refine((v) => v === true),
});

export type RegistrationForm = z.infer<typeof registrationSchema>;