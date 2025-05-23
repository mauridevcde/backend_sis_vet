import { Router } from "express";
import {
  getCategMascotas,
  getCategMascotasById,
  postCategMascotas,
  putCategMascotas,
  deleteCategMascotas,
} from "../controllers/categMascotas.controller";

const categMascotas = Router();

categMascotas.get("/CategMascotas", getCategMascotas);
categMascotas.get("/CategMascotas/:id", getCategMascotasById);
categMascotas.post("/CategMascotas", postCategMascotas);
categMascotas.put("/editarCategMascotas/:id", putCategMascotas);
categMascotas.put("/deleteCategMascotas/:id", deleteCategMascotas);

export default categMascotas;
