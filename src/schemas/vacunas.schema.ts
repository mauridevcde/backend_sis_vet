import { z } from "zod";

//   `id_vacuna` int unsigned NOT NULL AUTO_INCREMENT,
//   `id_cliente` int unsigned NOT NULL,
//   `nombre_vacuna` varchar(20) DEFAULT NULL,
//   `fecha_aplicacion` date DEFAULT NULL,
//   `proxima_dosis` date DEFAULT NULL,
//   `id_veterinario` int unsigned NOT NULL,
//   `estado` tinyint(1) DEFAULT NULL,

export type Vacuna = {
  id_vacuna: number;
  id_cliente: number;
  nombre_vacuna: string;
  fecha_aplicacion: Date;
  proxima_dosis: Date;
  id_veterinario: number;
  estado: boolean;
};

export const idParamsVacunaSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: "El ID debe ser numérico" }),
});

export const postVacunaSchema = z.object({
  id_vacuna: z.number().int().optional(),
  id_cliente: z
    .number()
    .int()
    .positive({ message: "ID de Cliente es requerido" }),
  nombre_vacuna: z.string().min(1).max(20),
  fecha_aplicacion: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de aplicación inválida",
    })
    .transform((date) => new Date(date)),
  proxima_dosis: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de próxima dosis inválida",
    })
    .transform((date) => new Date(date)),
  id_veterinario: z.number().int().positive(),
  estado: z.number().int().min(0).max(1),
});

export const putVacunaSchema = postVacunaSchema.partial();
