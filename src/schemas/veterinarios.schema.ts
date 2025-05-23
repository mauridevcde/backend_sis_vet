import { z } from "zod";

// Define the Veterinario type con los siguientes campos
//   `id_veterinario` int unsigned NOT NULL AUTO_INCREMENT,
//   `nombre_apellido` varchar(20) DEFAULT NULL,
//   `matricula` varchar(20) DEFAULT NULL,
//   `estado` tinyint(1) DEFAULT NULL,

export type veterinario = {
  id_veterinario: number;
  nombre_apellido: string;
  matricula: string;
  estado: number;
};

export const idParamsVeterinarioSchema = z.object({
  id: z
    .string()
    .min(1, { message: "ID de Veterinario es requerido" })
    .max(11, { message: "ID de Veterinario no puede exceder 100 caracteres" }),
});
export const postVeterinarioSchema = z.object({
  nombre_apellido: z
    .string()
    .min(1, { message: "Nombre y apellido es requerido" })
    .max(20, { message: "Nombre y apellido no puede exceder 20 caracteres" }),
  matricula: z
    .string()
    .min(1, { message: "Matricula es requerido" })
    .max(20, { message: "Matricula no puede exceder 20 caracteres" }),
  estado: z
    .number()
    .int()
    .min(0, { message: "Estado es requerido" })
    .max(1, { message: "Estado no puede ser mayor a 1" }),
});

export const putVeterinarioSchema = z.object({
  nombre_apellido: z
    .string()
    .min(1, { message: "Nombre y apellido es requerido" })
    .max(20, { message: "Nombre y apellido no puede exceder 20 caracteres" }),
  matricula: z
    .string()
    .min(1, { message: "Matricula es requerido" })
    .max(20, { message: "Matricula no puede exceder 20 caracteres" }),
  estado: z
    .number()
    .int()
    .min(0, { message: "Estado es requerido" })
    .max(1, { message: "Estado no puede ser mayor a 1" }),
});
