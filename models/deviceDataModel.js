import fetch from 'node-fetch';
import { config } from 'dotenv';
import path from 'path';

// Cargar las variables de entorno
config({
    path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env.vars'),
});

// mostrar todos los workspaces --> Desde la API de akenza
// export const fetchWorkspaces = async () => {

//     console.log(process.env.ID_ORGANIZACION);
//     try {
//         const response = await fetch(`https://api.akenza.io/v3/workspaces?organizationId=2814c3d718dd1526`,{
//             method : 'GET',
//             headers : {
//                 'Content-Type' : 'application/json',
//                 'x-api-key' : process.env.X_API_KEY
//             }
//         })

//         if (!response.ok) { throw new Error(`Error con la API : ${response.statusText}`); }

//         return await response.json();

//     } catch (error) {
//         console.error('Error en obtener datos de los workspace:', error.message);
//         throw error;
//     }
// }

// mostrar todos los dispositivos --> Desde la API de akenza
// export const fetchDevices = async (workspaceIds) => {

//     console.log("en el fetch modifi");
//     console.log(workspaceIds);
//     try {
//         const response = await fetch('https://api.akenza.io/v3/assets/list', {
//             method : 'POST',
//             headers : {
//                 'Content-Type' : 'application/json',
//                 'x-api-key' : process.env.X_API_KEY
//             },
//             body : JSON.stringify({
//                 organizationId : process.env.ID_ORGANIZACION,
//                 workspaceIds : workspaceIds
//             }),
//         })

//         if (!response.ok) { throw new Error(`Error con la API : ${response.statusText}`); }

//         // console.log(await response.json());
//         return await response.json();

//     } catch (error) {
//         console.error('Error en fetchDevices:', error.message);
//         throw error;
//     }
// }

// mostrar datos de un solo dispositivo --> Desde la API de akenza
// export const fetchDataDevice = async (deviceId) => {
//     try {
//         const response = await fetch(`https://api.akenza.io/v3/devices/${deviceId}`,{
//             method : 'GET',
//             headers : {
//                 'Content-Type' : 'application/json',
//                 'x-api-key' : process.env.X_API_KEY
//             }
//         })

//         if (!response.ok) { throw new Error(`Error con la API : ${response.statusText}`); }

//         return await response.json();

//     } catch (error) {
//         console.error('Error en obtener datos del dispositivo:', error.message);
//         throw error;
//     }
// }