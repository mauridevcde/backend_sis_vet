import { z } from "zod";

export type cirugia = {
  id_cirugia: number;
  id_cliente: number;
  fecha_cirugia: Date;
  tipo_cirugia: string;
  observaciones: string;
  id_veterinario: number;
  estado: number;
};

export const idParamsCirugiaSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: "El ID debe ser numérico" }),
});

export const postCirugiaSchema = z.object({
  id_cirugia: z.number().int().optional(),
  id_cliente: z
    .number()
    .int()
    .positive({ message: "ID de Cliente es requerido" }),
  fecha_cirugia: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de aplicación inválida",
    })
    .transform((date) => new Date(date)),
  tipo_cirugia: z.string().min(1).max(20),
  observaciones: z.string().min(1).max(20),
  id_veterinario: z.number().int().positive(),
  estado: z.number().int().min(0).max(1),
});

export const putCirugiaSchema = postCirugiaSchema.partial();
