-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: sis_veterinaria
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias_mascotas`
--

DROP TABLE IF EXISTS `categorias_mascotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_mascotas` (
  `id_categoria_mascota` int unsigned NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(20) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_categoria_mascota`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cirugias`
--

DROP TABLE IF EXISTS `cirugias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cirugias` (
  `id_cirugia` int unsigned NOT NULL AUTO_INCREMENT,
  `id_cliente` int unsigned NOT NULL,
  `fecha_cirugia` date DEFAULT NULL,
  `tipo_cirugia` varchar(20) DEFAULT NULL,
  `observaciones` varchar(20) DEFAULT NULL,
  `id_veterinario` int unsigned NOT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_cirugia`),
  KEY `cirugias_fk1_idx` (`id_cliente`),
  KEY `cirugias_fk2_idx` (`id_veterinario`),
  CONSTRAINT `cirugias_fk1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `cirugias_fk2` FOREIGN KEY (`id_veterinario`) REFERENCES `veterinarios` (`id_veterinario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_apellido` varchar(30) NOT NULL,
  `ruc` varchar(11) DEFAULT NULL,
  `ci` varchar(11) DEFAULT NULL,
  `nro_tel` varchar(20) DEFAULT NULL,
  `direccion` varchar(20) DEFAULT NULL,
  `correo` varchar(20) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `id_compra` int unsigned NOT NULL AUTO_INCREMENT,
  `id_proveedor` int unsigned NOT NULL,
  `id_usuario` int unsigned NOT NULL,
  `TotalNeto` decimal(10,2) DEFAULT NULL,
  `estado` enum('pendiente','recibida','anulada') DEFAULT NULL,
  `fecha_compra` timestamp NULL DEFAULT NULL,
  `FacturaNro` varchar(45) DEFAULT NULL,
  `TipoDeCompra` varchar(45) DEFAULT NULL,
  `Iva0` decimal(12,3) DEFAULT NULL,
  `Iva5` decimal(12,3) DEFAULT NULL,
  `Iva10` decimal(12,3) DEFAULT NULL,
  `SubTotal` decimal(12,3) DEFAULT NULL,
  PRIMARY KEY (`id_compra`),
  KEY `compras_fk1_idx` (`id_proveedor`),
  KEY `compras_fk2_idx` (`id_usuario`),
  CONSTRAINT `compras_fk1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  CONSTRAINT `compras_fk2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `consultas_clinicas`
--

DROP TABLE IF EXISTS `consultas_clinicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultas_clinicas` (
  `id_consulta` int unsigned NOT NULL AUTO_INCREMENT,
  `id_cliente` int unsigned NOT NULL,
  `fecha_consulta` datetime DEFAULT NULL,
  `motivo` varchar(60) DEFAULT NULL,
  `sintomas` varchar(60) DEFAULT NULL,
  `diagnostico` varchar(60) DEFAULT NULL,
  `tratamiento` varchar(60) DEFAULT NULL,
  `observaciones` varchar(60) DEFAULT NULL,
  `peso_kg` decimal(10,2) DEFAULT NULL,
  `temperatura_c` decimal(10,2) DEFAULT NULL,
  `id_veterinario` int unsigned NOT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_consulta`),
  KEY `consulta_fk1_idx` (`id_cliente`),
  KEY `consulta_fk2_idx` (`id_veterinario`),
  CONSTRAINT `consulta_fk1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `consulta_fk2` FOREIGN KEY (`id_veterinario`) REFERENCES `veterinarios` (`id_veterinario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detalle_compras`
--

DROP TABLE IF EXISTS `detalle_compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_compras` (
  `id_detalle_compra` int unsigned NOT NULL AUTO_INCREMENT,
  `id_compra` int unsigned NOT NULL,
  `id_producto` int unsigned NOT NULL,
  `id_usuario` int unsigned NOT NULL,
  `cantidad` int DEFAULT NULL,
  `costo` decimal(12,2) DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT NULL,
  `iva` decimal(12,2) DEFAULT NULL,
  `CostoMedio` decimal(12,3) DEFAULT NULL,
  PRIMARY KEY (`id_detalle_compra`),
  UNIQUE KEY `id_detalle_compra` (`id_detalle_compra`),
  KEY `detallecompra_fk2_idx` (`id_producto`),
  KEY `detallecompra_fk3_idx` (`id_usuario`),
  CONSTRAINT `detallecompra_fk2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `detallecompra_fk3` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detalle_ventas`
--

DROP TABLE IF EXISTS `detalle_ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_ventas` (
  `id_detalle_venta` int unsigned NOT NULL AUTO_INCREMENT,
  `id_venta` int unsigned NOT NULL,
  `id_producto` int unsigned NOT NULL,
  `id_usuario` int unsigned NOT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `iva` decimal(12,3) DEFAULT NULL,
  PRIMARY KEY (`id_detalle_venta`),
  KEY `detalleventa_fk1_idx` (`id_venta`),
  KEY `detalleventa_fk2_idx` (`id_producto`),
  KEY `detalleventa_fk3_idx` (`id_usuario`),
  CONSTRAINT `detalleventa_fk1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`),
  CONSTRAINT `detalleventa_fk2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `detalleventa_fk3` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mascotas`
--

DROP TABLE IF EXISTS `mascotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mascotas` (
  `id_mascota` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) DEFAULT NULL,
  `id_categoria_animal` int unsigned NOT NULL,
  `raza` varchar(20) DEFAULT NULL,
  `sexo` tinyint(1) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `id_cliente` int unsigned NOT NULL,
  PRIMARY KEY (`id_mascota`),
  KEY `mascotas_fk1_idx` (`id_categoria_animal`),
  KEY `mascotas_fk2_idx` (`id_cliente`),
  CONSTRAINT `mascotas_fk1` FOREIGN KEY (`id_categoria_animal`) REFERENCES `categorias_mascotas` (`id_categoria_mascota`),
  CONSTRAINT `mascotas_fk2` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `fecha_vencimiento` datetime DEFAULT NULL,
  `id_proveedor` int unsigned NOT NULL,
  `stock` int NOT NULL,
  `precio_compra` decimal(10,0) NOT NULL,
  `precio_venta` decimal(11,0) NOT NULL,
  `unidad_medida` varchar(20) DEFAULT NULL,
  `imagen` varchar(150) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `TipoDeVenta` varchar(45) DEFAULT NULL,
  `iva` tinyint(1) DEFAULT NULL,
  `id_usuario` int unsigned NOT NULL,
  `codigoDeBarra` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `producto_fk1_idx` (`id_proveedor`),
  KEY `producto_fk2_idx` (`id_usuario`),
  CONSTRAINT `producto_fk1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  CONSTRAINT `producto_fk2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id_proveedor` int unsigned NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(40) DEFAULT NULL,
  `razon_social` varchar(40) DEFAULT NULL,
  `ruc` varchar(20) DEFAULT NULL,
  `direccion` varchar(60) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `registros_clinicos`
--

DROP TABLE IF EXISTS `registros_clinicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros_clinicos` (
  `id_registro_clinico` int unsigned NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(20) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `id_cliente` int unsigned NOT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_registro_clinico`),
  KEY `registro_fk1_idx` (`id_cliente`),
  CONSTRAINT `registro_fk1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_roles` int unsigned NOT NULL AUTO_INCREMENT,
  `tipoRol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_roles`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_apellido` varchar(60) NOT NULL,
  `id_rol` int unsigned NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `password` varchar(120) NOT NULL,
  `estado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_usuario`),
  KEY `usuarios_fk1_idx` (`id_rol`),
  CONSTRAINT `usuarios_fk1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_roles`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vacunas`
--

DROP TABLE IF EXISTS `vacunas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacunas` (
  `id_vacuna` int unsigned NOT NULL AUTO_INCREMENT,
  `id_cliente` int unsigned NOT NULL,
  `nombre_vacuna` varchar(20) DEFAULT NULL,
  `fecha_aplicacion` date DEFAULT NULL,
  `proxima_dosis` date DEFAULT NULL,
  `id_veterinario` int unsigned NOT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_vacuna`),
  KEY `vacuna_fk1_idx` (`id_cliente`),
  KEY `vacuna_fk2_idx` (`id_veterinario`),
  CONSTRAINT `vacuna_fk1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `vacuna_fk2` FOREIGN KEY (`id_veterinario`) REFERENCES `veterinarios` (`id_veterinario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id_venta` int unsigned NOT NULL AUTO_INCREMENT,
  `id_cliente` int unsigned NOT NULL,
  `id_usuario` int unsigned NOT NULL,
  `fecha_venta` datetime DEFAULT NULL,
  `total` decimal(12,2) DEFAULT NULL,
  `estado` enum('pagada','pendiente','anulada') DEFAULT NULL,
  `tipo_pago` enum('efectivo','tarjeta','transferencia','credito') DEFAULT NULL,
  `tipo_venta` enum('contado','cuota') DEFAULT NULL,
  `subTotal` decimal(12,3) DEFAULT NULL,
  `Iva0` decimal(12,3) DEFAULT NULL,
  `Iva5` decimal(12,3) DEFAULT NULL,
  `Iva10` decimal(12,3) DEFAULT NULL,
  `TotalDescuento` decimal(12,3) DEFAULT NULL,
  `id_caja` varchar(45) DEFAULT '0',
  PRIMARY KEY (`id_venta`),
  KEY `ventas_fk1_idx` (`id_cliente`),
  KEY `ventas_fk2_idx` (`id_usuario`),
  CONSTRAINT `ventas_fk1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `ventas_fk2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `veterinarios`
--

DROP TABLE IF EXISTS `veterinarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `veterinarios` (
  `id_veterinario` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_apellido` varchar(20) DEFAULT NULL,
  `matricula` varchar(20) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_veterinario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-10  6:10:58
