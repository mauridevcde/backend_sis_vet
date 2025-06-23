import { Router } from "express";
import { getAllVentaJoin, getAllVentas, postVentaCompleta } from "../controllers/ventas.controller";

const ventas = Router();

ventas.get("/ventas", getAllVentas)
ventas.post("/ventaCompleta", postVentaCompleta);
ventas.get("/ventaJoin", getAllVentaJoin);

export default ventas;
