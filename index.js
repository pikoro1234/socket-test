import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import workspaceRoutes from './routes/workspaceRoute.js';
import deviceRoutes from './routes/deviceRoute.js';
import deviceDataRoutes from './routes/deviceDataRoute.js';

// import regeneradas 
import urbidermisRouter from './routes/urbidermis/urbidermisRoute.js';
import authMiddleware from './middleware/authMiddleware.js';
import authRouter from './routes/users/authRouter.js'
import userRouter from './routes/users/userRouter.js';
import projectRouter from './routes/projects/projectRouter.js';
import deviceRouter from './routes/devices/deviceRouter.js';

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
    origin: [ "http://localhost:3004", "http://34.175.190.28", "https://www.urbidermis.com", "https://urbicomm.io" ],
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
app.use('/workspaces', workspaceRoutes);

// devices -> akenza
// app.use('/devices', deviceRoutes);

// obtenemos los datos de influxDB /single-device-data
app.use('/data-device', deviceDataRoutes);

// data influx IA
app.use('/data-ia', deviceDataRoutes);

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
                        { name: "solana 1", id: "JAT1001A", uuiID: "02f8c787a749767a" },
                        { name: "solana 2", id: "JAT1002A", uuiID: "02a88271804a3bd4" }

                    ]
                },
                {
                    name: "Port Ginesta",
                    devices: [
                        { name: "solana 3", id: "JAT1003A", uuiID: "02c4819a475fe4ca" },
                        { name: "solana 4", id: "JAT1004A", uuiID: "02ffd0d907664d07" }

                    ]
                },
                {
                    name: "Marina Palamos",
                    devices: [
                        { name: "solana 5", id: "JAT1005A", uuiID: "02d5029c2216f2bf" },
                        { name: "solana 6", id: "JAT1006A", uuiID: "0254bc752b6acdf6" }

                    ]
                }, {
                    name: "Roca Valles",
                    devices: [
                        { name: "solana 7", id: "JAT1007A", uuiID: "02c9d061ff686311" },
                        { name: "solana 8", id: "JAT1008A", uuiID: "028443cf9667e55e" },
                        { name: "solana 9", id: "JAT1009A", uuiID: "0234ccc76a2782bb" }

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

app.get('/logout', (req, res) => {
    try {
        // if (!req.body.username) {
        //     res.status(404).json({ message: 'User/Password Not Found' });
        // }

        // if (!req.body.userpassword) {
        //     res.status(404).json({ message: 'User/Password Not Found' });
        // }

        res.status(200).json({ message: 'login correct' })
    } catch (error) {
        console.log("error en la logica del login");
        console.log(error);
    }
})

//********* REORGANIZAMOS RUTAS CON TOKKEN Y PUBLICAS

// auth router
app.use('/auth', authRouter); // Login, Logout, Refresh

// data user
app.use('/user', authMiddleware, userRouter); // Profile, Data, etc

// crud projects
app.use('/projects', authMiddleware, projectRouter) // Project || sub-projects --- create/update/delete

// crud devices
app.use('/devices', authMiddleware, deviceRouter); // Devices --- Get - Post - Put

// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});