import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// import regeneradas 
import authMiddleware from './middleware/authMiddleware.js';
import verifyMiddleware from './middleware/verifyMiddleware.js';
import urbidermisRouter from './routes/urbidermis/urbidermisRouter.js';
import authRouter from './routes/users/authRouter.js'
import userRouter from './routes/users/userRouter.js';
import projectRouter from './routes/projects/projectRouter.js';
import deviceRouter from './routes/devices/deviceRouter.js';
import apiKeyRouter from './routes/apiKey/apiKeyRouter.js';
import iaRouter from './routes/iA/iaRouter.js';

// import librerias para generar documentacion
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';

// Cargar las variables de entorno
config({ path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env'), });

// Inicializar la aplicación Express
const app = express();

// Middleware para analizar JSON en el cuerpo de las solicitudes
app.use(express.json());

// Permitir el uso e intercambio de cookies
app.use(cookieParser());

// Generamos objeto cors que permite el envio y uso de cookies entre el servidor y el cliente
const corsOptions = {
    origin: [ "http://localhost:3004", "https://citydev.urbicomm.io", "https://www.urbidermis.com", "https://urbicomm.io", "https://citypre.urbicomm.io" ],
    methods: [ "GET", "POST", "PUT", "DELETE", "OPTIONS" ],
    allowedHeaders: [ "Content-Type", "Authorization" ],
    credentials: true,
};

// Aplicar CORS de forma global ANTES de las rutas
app.use(cors(corsOptions));

// Middleware para manejar preflight requests (Opcional)
app.options("*", cors(corsOptions));

// Eliminamos el aviso de que frame utilizamos
app.disable('x-powered-by');

// variable ruta raiz 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir el puerto para el servidor
const PORT = process.env.PORT || 3002;

// ruta principal Urbicomm.io
app.get('/', async (req, res) => { try { res.sendFile(path.join(__dirname, 'index.html')); } catch (error) { res.status(500).json({ error: 'Error en levantar la pagina principal' }); } });

// ruta doc -> generada por swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//********* API

// insert registre files to urbidermis web
app.use('/urbidermis-download', verifyMiddleware, urbidermisRouter); // File downloader to urbidermis web

// auth router
app.use('/auth', authRouter); // Login, Logout, Refresh

// data user
app.use('/user', authMiddleware, userRouter); // Profile, Data, etc

// crud projects
app.use('/projects', authMiddleware, projectRouter) // Project || sub-projects --- create/update/delete

// crud devices
app.use('/devices', authMiddleware, deviceRouter); // Devices --- Get - Post - Put

// data procesing for IA V.1
app.use('/data-ia', authMiddleware, iaRouter)  // query automatice sql - fluxed queries

// ADMIN GENERATE ,UPDATE DELETE TOKKEN STATIC
app.use('/protected', apiKeyRouter);























// const preguntasSimilares = [
//     "Cuantos dispositivos tengo?",
//     "Cuantos dispositivos tengo?",
//     "que cantidad de proyectos tengo?",
//     // "¿Dónde está ubicado el dispositivo?",
//     // "¿Cuál es la ubicación del sensor?",
//     // "Dame la localización del dispositivo",
//     // "¿Dónde se encuentra instalado el equipo?",
//     // "Muéstrame el lugar del dispositivo",
//     // "Ubicación actual del dispositivo",
//     // "¿Dónde está el sensor ahora?",
//     // "Posición del dispositivo",
//     // "¿En qué ciudad está el dispositivo?",
//     // "¿Dónde fue instalado el sensor?"
//   ];





//   import stringSimilarity from "string-similarity";

// // const promptUsuario = "Dime dónde se encuentra el dispositivo";
// const promptUsuario = "dime cuantos devices tengo";

// const { bestMatch } = stringSimilarity.findBestMatch(promptUsuario, preguntasSimilares);

// console.log("Pregunta más parecida:", bestMatch.target);
// console.log("Similitud:", bestMatch.rating);

// // Validación
// if (bestMatch.rating > 0.6) {
//   console.log("✅ Pregunta válida");
// } else {
//   console.log("❌ Pregunta no reconocida");
// }
































// Iniciar el servidor
const server = app.listen(PORT, () => {
    // console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});