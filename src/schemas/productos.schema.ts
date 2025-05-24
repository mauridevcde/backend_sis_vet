import { z } from "zod";

export type producto = {
  id_producto: number;
  nombre: string;
  fecha_vencimiento: Date;
  id_proveedor: number;
  stock: number;
  precio_compra: number;
  precio_venta: number;
  unidad_medida: string;
  imagen: string;
  estado: number;
};

export const idParamsProductosSchema = z.object({
  id: z
    .string()
    .min(1, { message: "ID de CategMascotas es requerido" })
    .max(11, {
      message: "ID de CategMascotas no puede exceder 100 caracteres",
    }),
});

export const postProductoSchema = z.object({
  nombre: z.string().min(1).max(50),
  fecha_vencimiento: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de aplicación inválida",
    })
    .transform((date) => new Date(date)),
  id_proveedor: z.number().int(),
  stock: z.number().int(),
  precio_compra: z.number(),
  precio_venta: z.number(),
  unidad_medida: z.string().min(1).max(20),
  imagen: z.string().optional(),
  estado: z.number().optional(),
});

export const putProductoSchema = postProductoSchema.partial();
