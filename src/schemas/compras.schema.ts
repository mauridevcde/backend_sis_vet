import { z } from "zod";

export type compra = z.infer<typeof postCompraSchema>;
export type detalleCompra = z.infer<typeof postDetalleCompraSchema>;

export const getByIdCompraSchema = z.object({
  id: z.string().min(1),
});

export const postCompraSchema = z.object({
  id_proveedor: z.number().int().optional(),
  id_usuario: z.number().int(),
  TotalNeto: z.number().optional(),
  estado: z.enum(["pendiente", "recibida", "anulada"]).optional(),
  fecha_compra: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Debe ser una fecha válida en formato ISO",
    })
    .transform((val) => new Date(val)),
  FacturaNro: z.string().max(45).optional(),
  TipoDeCompra: z.string().max(45).optional(),
  Iva0: z.number().optional(),
  Iva5: z.number().optional(),
  Iva10: z.number().optional(),
  SubTotal: z.number().optional(),
});

export const postDetalleCompraSchema = z.object({
  id_compra: z.number().int().optional(),
  id_producto: z.number().int(),
  id_usuario: z.number().int(),
  cantidad: z.number().int(),
  costo: z.number(),
  subtotal: z.number(),
  iva: z.number(),
  CostoMedio: z.number(),
});
