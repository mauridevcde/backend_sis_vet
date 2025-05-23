import { z } from "zod";

export type catmascota = {
  id_categoria_mascota: number;
  descripcion: string;
  estado: number;
};

export const idCatParamsmascotaSchema = z.object({
  id: z
    .string()
    .min(1, { message: "El id_categoria_mascota es requerido" })
    .regex(/^[0-9]+$/, {
      message: "El id_categoria_mascota debe ser un número",
    }),
});

export const postcatmascotaSchema = z.object({
  descripcion: z
    .string()
    .min(1, { message: "La descripcion es requerida" })
    .max(20, { message: "La descripcion no puede tener más de 20 caracteres" }),
  estado: z
    .number()
    .min(0, { message: "El estado es requerido" })
    .max(1, { message: "El estado no puede ser mayor a 1" })
    .optional(),
});

export const putcatmascotaSchema = z.object({
  descripcion: z
    .string()
    .min(1, { message: "La descripcion es requerida" })
    .max(20, { message: "La descripcion no puede tener más de 20 caracteres" }),
  estado: z
    .number()
    .min(0, { message: "El estado es requerido" })
    .max(1, { message: "El estado no puede ser mayor a 1" })
    .optional(),
});
