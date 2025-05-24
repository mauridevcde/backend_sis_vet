import { z } from "zod";

export type proveedor = {
  id_proveedor: number;
  descripcion: string;
  razon_social: string;
  ruc: string;
  direccion: string;
  estado: number;
};

export const idParamsProveedoresSchema = z.object({
  id: z
    .string()
    .min(1, { message: "ID de CategMascotas es requerido" })
    .max(11, {
      message: "ID de CategMascotas no puede exceder 100 caracteres",
    }),
});

export const proveedorSchema = z.object({
  id_proveedor: z.number().int(),
  descripcion: z.string().min(1).max(40),
  razon_social: z.string().min(1).max(40),
  ruc: z.string().min(1).max(20),
  direccion: z.string().min(1).max(60),
  estado: z.number().optional(),
});

export const postProveedorSchema = z.object({
  descripcion: z.string().min(1).max(40),
  razon_social: z.string().min(1).max(40),
  ruc: z.string().min(1).max(20),
  direccion: z.string().min(1).max(60),
  estado: z.number().optional(),
});

export const putProveedorSchema = postProveedorSchema.partial();
