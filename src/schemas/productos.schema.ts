import { z } from "zod";
// `id_producto` int unsigned NOT NULL AUTO_INCREMENT,
// `nombre` varchar(50) DEFAULT NULL,
// `fecha_vencimiento` datetime DEFAULT NULL,
// `id_proveedor` int unsigned NOT NULL,
// `stock` int NOT NULL,
// `precio_compra` decimal(10,0) NOT NULL,
// `precio_venta` decimal(11,0) NOT NULL,
// `unidad_medida` varchar(20) DEFAULT NULL,
// `imagen` varchar(150) DEFAULT NULL,
// `estado` tinyint(1) DEFAULT NULL,
// `TipoDeVenta` varchar(45) DEFAULT NULL,
// `iva` tinyint(1) DEFAULT NULL,
// `id_usuario` int unsigned NOT NULL,
// `codigoDeBarra` varchar(45) DEFAULT NULL,

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
  TipoDeVenta: string;
  iva: number;
  id_usuario: number;
  codigoDeBarra: string;
};

export const idParamsProductosSchema = z.object({
  id: z
    .string()
    .min(1, { message: "ID de CategMascotas es requerido" })
    .max(11, {
      message: "ID de CategMascotas no puede exceder 11 caracteres",
    }),
});

export const postProductoSchema = z.object({
  nombre: z.string().min(1).max(100),
  fecha_vencimiento: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de aplicación inválida",
    })
    .transform((date) => new Date(date)),
  id_proveedor: z.number().int(),
  stock: z.number().int(),
  precio_compra: z.number().int(),
  precio_venta: z.number().int(),
  unidad_medida: z.string().max(20).optional(),
  imagen: z.string().max(150).optional(),
  estado: z.number().int().optional(),
  TipoDeVenta: z.string().max(45).optional(),
  iva: z.number().int().optional(),
  id_usuario: z.number().int(),
  codigoDeBarra: z.string().max(45).optional(),
});

export const putProductoSchema = postProductoSchema.partial();
