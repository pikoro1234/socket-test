import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyTokken } from './services/generateTokken.js';
import workspaceRoutes from './routes/workspaceRoute.js';
import deviceRoutes from './routes/deviceRoute.js';
import deviceDataRoutes from './routes/deviceDataRoute.js';
import userRouter from './routes/users/userRoute.js';
import urbidermisRouter from './routes/urbidermis/urbidermisRoute.js';

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
app.use('/data-ia', verifyTokken, deviceDataRoutes);

// insercion de ficheros descargables para web urbidermis
app.use('/urbidermis-download', urbidermisRouter);

// example para lucas
app.get('/data-server', (req, res) => {
    try {
        // if (!req.body.username) {
        //     res.status(404).json({ message: 'User/Password Not Found' });
        // }

        // if (!req.body.userpassword) {
        //     res.status(404).json({ message: 'User/Password Not Found' });
        // }

        // res.status(200).json({ message: 'login correct' })
        res.status(200).json({
            user: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXN1YXJpbyIsImlhdCI6MTczMDk4NTM2NH0',
            rol: 'superAdmin',
            projects: [
                {
                    name: "Girona",
                    devices: [
                        { name: "solana 1", id: "JAT1001A" },
                        { name: "solana 2", id: "JAT1002A" }

                    ]
                },
                {
                    name: "Port Ginesta",
                    devices: [
                        { name: "solana 3", id: "JAT1003A" },
                        { name: "solana 4", id: "JAT1004A" }

                    ]
                },
                {
                    name: "Marina Palamos",
                    devices: [
                        { name: "solana 5", id: "JAT1005A" },
                        { name: "solana 6", id: "JAT1006A" }

                    ]
                }, {
                    name: "Roca Valles",
                    devices: [
                        { name: "solana 7", id: "JAT1007A" },
                        { name: "solana 8", id: "JAT1008A" },
                        { name: "solana 9", id: "JAT1009A" }

                    ]
                }
            ]
        },
            {
                user: 'eyJhbGcirrwsrtESDIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXN1YXJpbyIsImlhdCI6MTczMDk4NTM2NH0',
                rol: 'admin',
                projects: [
                    {
                        name: "Port Ginesta",
                        devices: [
                            { name: "solana 3", id: "JAT1003A" },
                            { name: "solana 4", id: "JAT1004A" }

                        ]
                    }
                ]
            },
            {
                user: 'eyJhbGcirrwsrtESDIsInR5cCI6IkpXVCJ9.eyJyb2xlIRREQWWED1YXJpbyIsImlhdCI6MTczMDk4NTM2NH0',
                rol: 'user',
                projects: [
                    {
                        name: "Port Ginesta",
                        devices: [
                            { name: "solana 4", id: "JAT1004A" }

                        ]
                    }
                ]
            })

    } catch (error) {
        console.log("error en la logica del login");
        console.log(error);
    }
})

app.use('/login', userRouter)

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