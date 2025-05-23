import { Router } from "express";
import {
  getMascotas,
  getMascotasById,
  postMascotas,
  putMascotas,
  deleteMascotas,
} from "../controllers/mascotas.controllers";
const mascotas = Router();

mascotas.get("/mascotas", getMascotas);

mascotas.get("/mascotas/:id", getMascotasById);

mascotas.post("/mascotas", postMascotas);

mascotas.put("/editarMascotas/:id", putMascotas);

mascotas.put("/deleteMascotas/:id", deleteMascotas);

export default mascotas;
