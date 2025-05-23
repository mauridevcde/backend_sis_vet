import { Router } from "express";
import {
  getConsultasClinicas,
  getConsultaClinicaById,
  postConsultaClinica,
  putConsultaClinica,
  deleteConsultaClinica,
} from "../controllers/consultasClinicas.controller";

const consultasClinicas = Router();

consultasClinicas.get("/consultasClinicas", getConsultasClinicas);

consultasClinicas.get("/consultasClinicas/:id", getConsultaClinicaById);

consultasClinicas.post("/consultasClinicas", postConsultaClinica);

consultasClinicas.put("/editarConsultasClinicas/:id", putConsultaClinica);

consultasClinicas.put("/eliminarConsultasClinicas/:id", deleteConsultaClinica);

export default consultasClinicas;
