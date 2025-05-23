import { z } from "zod";

//con esta data generame el schema
// "id_mascota": 1,
// 		"nombre": "walter",
// 		"id_categoria_animal": 1,
// 		"raza": "gran danes",
// 		"sexo": 1,
// 		"estado": 1

export type mascota = {
  id_mascota: number;
  nombre: string;
  id_categoria_animal: number;
  raza: string;
  sexo: number;
  estado: number;
};



export const idParamsmascotaSchema = z.object({
  id: z
    .string()
    .min(1, { message: "ID de CategMascotas es requerido" })
    .max(11, { message: "ID de CategMascotas no puede exceder 100 caracteres" }),
});

export const postmascotaSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .max(20, { message: "Nombre no puede exceder 20 caracteres" }),
  id_categoria_animal: z
    .number()
    .int()
    .min(1, { message: "ID de categoria animal es requerido" })
    .max(100, { message: "ID de categoria animal no puede exceder 100" }),
  raza: z
    .string()
    .min(1, { message: "Raza es requerido" })
    .max(11, { message: "Raza no puede exceder 11 caracteres" }),
  sexo: z
    .number()
    .int()
    .min(0, { message: "Sexo es requerido" })
    .max(1, { message: "Sexo no puede exceder 1" }),
  estado: z
    .number()
    .int()
    .min(0, { message: "Estado es requerido" })
    .max(1, { message: "Estado no puede ser mayor a 1" }),
});

export const putmascotaSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .max(20, { message: "Nombre no puede exceder 20 caracteres" }),
  id_categoria_animal: z
    .number()
    .int()
    .min(1, { message: "ID de categoria animal es requerido" })
    .max(100, { message: "ID de categoria animal no puede exceder 100" }),
  raza: z
    .string()
    .min(1, { message: "Raza es requerido" })
    .max(20, { message: "Raza no puede exceder 20 caracteres" }),
  sexo: z
    .number()
    .int()
    .min(0, { message: "Sexo es requerido" })
    .max(1, { message: "Sexo no puede exceder 1" }),
  estado: z
    .number()
    .int()
    .min(0, { message: "Estado es requerido" })
    .max(1, { message: "Estado no puede ser mayor a 1" }),
});
