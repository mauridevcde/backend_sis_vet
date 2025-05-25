import { Router } from "express";
import { getAllVentas, postVentaCompleta } from "../controllers/ventas.controller";

const ventas = Router();

ventas.get("/ventas", getAllVentas)
ventas.post("/ventaCompleta", postVentaCompleta);

export default ventas;
