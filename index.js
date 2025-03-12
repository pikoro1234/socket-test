import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyTokken } from './services/generateTokken.js';
import workspaceRoutes from './routes/workspaceRoute.js';
import deviceRoutes from './routes/deviceRoute.js';
import deviceDataRoutes from './routes/deviceDataRoute.js';

import { sendMqttPrompt } from './services/sendMqttGeneric.js';

// import librerias para generar documentacion
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';

// Cargar las variables de entorno
config({ path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env'), });

// Inicializar la aplicación Express
const app = express();

// Middleware para analizar JSON en el cuerpo de las solicitudes
app.use(express.json());

// Permitir CORS para todas las rutas
app.use(cors());

// Eliminamos el aviso de que frame utilizamos
app.disable('x-powered-by');

// variable ruta raiz 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir el puerto para el servidor
const PORT = process.env.PORT || 3002;

// ruta principal Urbicomm.io
app.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'index.html'));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error en levantar la pagina principal' });
    }
});

// ruta doc -> generada por swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// workspaces -> akenza
app.use('/workspaces', verifyTokken, workspaceRoutes);

// devices -> akenza
app.use('/devices', verifyTokken, deviceRoutes);

// obtenemos los datos de influxDB /single-device-data
app.use('/data-device', verifyTokken, deviceDataRoutes);

// data influx IA
app.post('/data-ia/processing', async (req, res) => {
    const { prompt } = req.body;
    try {

        if (prompt === '') return res.status(400).json({ status: "error", message: "text required" })

        const response = await sendMqttPrompt(prompt);

        return res.json(response);

    } catch (error) {

        console.log("entramos al catch");
        return res.status(500).json({ status: "error", message: error });
    }
})

// validacion y control del login MYQL/MONGO,etc
app.post('/login', (req, res) => {
    try {
        if (!req.body.username) {
            res.status(404).json({ message: 'User/Password Not Found' });
        }

        if (!req.body.userpassword) {
            res.status(404).json({ message: 'User/Password Not Found' });
        }

        res.status(200).json({ message: 'login correct' })
    } catch (error) {
        console.log("error en la logica del login");
        console.log(error);
    }
})

app.post('/logout', (req, res) => {
    try {
        if (!req.body.username) {
            res.status(404).json({ message: 'User/Password Not Found' });
        }

        if (!req.body.userpassword) {
            res.status(404).json({ message: 'User/Password Not Found' });
        }

        res.status(200).json({ message: 'login correct' })
    } catch (error) {
        console.log("error en la logica del login");
        console.log(error);
    }
})

// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});