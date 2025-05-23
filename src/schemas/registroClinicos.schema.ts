import { z } from "zod";

export type registroClinico = {
  id_registro_clinico: number;
  Descripcion: string;
  fecha: Date;
  id_cliente: number;
  estado: boolean;
};

export const postRegistroClinicoSchema = z.object({
  Descripcion: z.string().min(1, { message: "Descripcion is required" }),
  fecha: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de aplicación inválida",
    })
    .transform((date) => new Date(date)),
  id_cliente: z.number().int().positive(),
  estado: z.number().int().min(0).max(1).optional(),
});

export const putRegistroClinicoSchema = postRegistroClinicoSchema.partial();
