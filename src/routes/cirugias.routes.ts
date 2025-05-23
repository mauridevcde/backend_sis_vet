// src/routes/cirugias.routes.ts
import { Router } from "express";
import {
  getCirugias,
  getCirugiaById,
  postCirugia,
  putCirugia,
  deleteCirugia,
} from "../controllers/cirugias.controller";

const cirugias = Router();

cirugias.get("/cirugias", getCirugias);
cirugias.get("/cirugias/:id", getCirugiaById);
cirugias.post("/cirugias", postCirugia);
cirugias.put("/editarCirugia/:id", putCirugia);
cirugias.put("/deleteCirugia/:id", deleteCirugia);

export default cirugias;
