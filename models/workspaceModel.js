// import fetch from 'node-fetch';
// import { config } from 'dotenv';
// import path from 'path';

// // Cargar las variables de entorno
// config({
//     path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env.vars'),
// })

// mostrar todos los workspaces --> Desde la API de akenza
// export const fetchWorkspaces = async () => {
//     try {
//         const response = await fetch(`apidash/workspaces?organizationId=2814c3d718dd1526`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-api-key': `3beff9bb15cd6dd7.06e97757-5b92-4967-9437-a0a949c43270`
//             }
//         })

//         if (!response.ok) { throw new Error(`Error con la API : ${response.statusText}`); }

//         return await response.json();

//     } catch (error) {
//         console.error('Error en obtener datos de los workspace:', error.message);
//         throw error;
//     }
// }