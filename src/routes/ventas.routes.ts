import { Router } from "express";
import { getAllVentaJoin, getAllVentas, getDetalleByVentaID, postVentaCompleta } from "../controllers/ventas.controller";

const ventas = Router();

ventas.get("/ventas", getAllVentas)
ventas.post("/ventaCompleta", postVentaCompleta);
ventas.get("/ventaJoin", getAllVentaJoin);
ventas.get("/detallesVentas/:id", getDetalleByVentaID);


export default ventas;
