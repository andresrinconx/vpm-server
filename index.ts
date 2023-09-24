import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import vetRoutes from "./routes/vetRoutes";
import clientRoutes from './routes/clientRoutes'

const app = express();
app.use(express.json()); // para que express pueda interpretar el body de las peticiones HTTP
dotenv.config(); // escanea las variables de entorno para poder usarlas en todo el proyecto
connectDB();

const corsOptions = {
  origin: `${process.env.CLIENT_URL}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions)); // cors es un middleware que permite que el frontend se comunique con el backend

// use toma dos parametros, el primero establece la ruta base, el segundo es todo el router de express
app.use("/api/vets", vetRoutes);
app.use("/api/clients", clientRoutes);

const port = process.env.PORT || 4000;

// en este punto app ya tiene el routing
app.listen(port, () => { // listen inicia el servidor en un puerto especifico, el callback es lo que se ejecuta cuando el puerto esta listo
  console.log(`Working on port ${port}`);
});