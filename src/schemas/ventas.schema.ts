import { z } from "zod";

export type detalleVenta = z.infer<typeof postVentaSchema>;



// Schema venta (cabecera)
export const postVentaSchema = z.object({
  id_cliente: z.number().int(),
  id_usuario: z.number().int(),
  fecha_venta: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Debe ser una fecha válida en formato ISO",
    })
    .transform((val) => new Date(val)),
  total: z.number().optional(),
  estado: z.enum(["pagada", "pendiente", "anulada"]).optional(),
  tipo_pago: z
    .enum(["efectivo", "tarjeta", "transferencia", "credito"])
    .optional(),
  tipo_venta: z.enum(["contado", "cuota"]).optional(),
  subTotal: z.number().optional(),
  Iva0: z.number().optional(),
  Iva5: z.number().optional(),
  Iva10: z.number().optional(),
  TotalDescuento: z.number().optional(),
  id_caja: z.string().max(45).optional(),
});

export const postDetalleVentaSchema = z.object({
  id_venta: z.string().min(1).optional(),
  id_producto: z.number().int(),
  id_usuario: z.number().int(),
  cantidad: z.number().int(),
  precio_unitario: z.number(),
  subtotal: z.number(),
  estado: z.number().optional(),
  iva: z.number(),
});

export const getByIdVentaSchema = z.object({
  id: z.string().min(1),
});

export const mesSchema  = z.object({
  mes: z.string().min(1),
});
