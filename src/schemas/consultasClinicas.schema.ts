import { z } from "zod";

// Tipo de dato
export type consultaClinica = {
  id_consulta: number;
  id_cliente: number;
  fecha_consulta: Date;
  motivo: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  peso_kg: number;
  temperatura_c: number;
  id_veterinario: number;
  estado: number;
};

// Validación para params
export const idParamsConsultaClinicaSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: "El ID debe ser numérico" }),
});

// Esquema para POST
export const postConsultaClinicaSchema = z.object({
  id_cliente: z
    .number()
    .int()
    .positive({ message: "ID de Cliente es requerido" }),
  fecha_consulta: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de consulta inválida",
    })
    .transform((date) => new Date(date)),
  motivo: z.string().min(1).max(60),
  sintomas: z.string().min(1).max(60),
  diagnostico: z.string().min(1).max(60),
  tratamiento: z.string().min(1).max(60),
  observaciones: z.string().min(1).max(60),
  peso_kg: z.number().min(0.01).max(999.99),
  temperatura_c: z.number().min(0.01).max(999.99), // Rango lógico de temperatura corporal
  id_veterinario: z.number().int().positive(),
  estado: z.number().int().min(0).max(1),
});

// Esquema para PUT (campos opcionales)
export const putConsultaClinicaSchema = postConsultaClinicaSchema.partial();
