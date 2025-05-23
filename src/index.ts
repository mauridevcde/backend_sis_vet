import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import auth from "./routes/auth.routes";
import { PORT } from "./config";
import { VerifyAuthentication } from "./middleware/requireAuth";
import clientes from "./routes/clientes.routes";
import mascotas from "./routes/mascotas.routes";
import categMascotas from "./routes/categoria_mascotas.routes";
import veterinarios from "./routes/veterinarios.routes";
import consultasClinicas from "./routes/consultasClinicas.routes";
import vacunas from "./routes/vacunas.routes";
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"], // Permitir solo estos encabezados
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/auth", auth);
app.use("/api", VerifyAuthentication, clientes);
app.use("/api", VerifyAuthentication, mascotas);
app.use("/api", VerifyAuthentication, categMascotas);
app.use("/api", VerifyAuthentication, veterinarios);

app.use("/api", VerifyAuthentication, vacunas);
app.listen(PORT);
console.log(`Server corriendo en el puerto ${PORT}`);
