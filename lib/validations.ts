import { z } from "zod";

export const CheckoutSchema = z.object({
  firstName: z.string().min(2, "Vorname zu kurz"),
  lastName: z.string().min(2, "Nachname zu kurz"),
  email: z.string().email("Ungültige E-Mail"),
  phone: z.string().optional(),
  street: z.string().min(5, "Adresse zu kurz"),
  city: z.string().min(2, "Stadt zu kurz"),
  zip: z.string().regex(/^\d{4,5}$/, "Ungültige PLZ"),
  country: z.string().default("DE"),
});

export const NewsletterSchema = z.object({
  email: z.string().email("Ungültige E-Mail"),
});

export const DiscountCheckSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().positive(),
});

export const ProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().optional(),
  stock: z.number().int().min(0),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  sport: z.array(z.string()),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;
