import { Router } from "express";
import {
  getAllVentaJoin,
  getAllVentas,
  getDetalleByVentaID,
  getTotalVentasPorMes,
  getVentasMensuales,
  getVentasPorDia,
  postVentaCompleta,
} from "../controllers/ventas.controller";

const ventas = Router();

ventas.get("/ventas", getAllVentas);
ventas.post("/ventaCompleta", postVentaCompleta);
ventas.get("/ventaJoin", getAllVentaJoin);
ventas.get("/detallesVentas/:id", getDetalleByVentaID);
ventas.get("/reportes/detalleVentaPorDiaDelMes", getVentasPorDia);
ventas.get("/reportes/ventas/mensuales", getVentasMensuales);
ventas.get("/reportes/ventas/totalVentaPorMes", getTotalVentasPorMes);

export default ventas;
