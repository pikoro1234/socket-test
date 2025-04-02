// import fetch from 'node-fetch';
// import { config } from 'dotenv';
// import path from 'path';

// Cargar las variables de entorno
// config({
//     path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env.vars'),
// });

// mostrar todos los dispositivos --> Desde la API de akenza
// export const fetchDevices = async (workspaceIds) => {
//     try {
//         const response = await fetch('apidash/v3/assets/list?size=50', {
//             method: 'POST',

//             body: JSON.stringify({
//                 organizationId:",2814c3d718dd1526
//                 workspaceIds: workspaceIds
//             }),
//         })

//         if (!response.ok) { throw new Error(`Error con la API : ${response.statusText}`); }

//         return await response.json();

//     } catch (error) {
//         console.error('Error en fetchDevices:', error.message);
//         throw error;
//     }
// }

// mostrar datos de un solo dispositivo --> Desde la API de akenza
// export const fetchDataDevice = async (deviceId) => {
//     try {


//         if (!response.ok) { throw new Error(`Error con la API : ${response.statusText}`); }

//         return await response.json();

//     } catch (error) {
//         console.error('Error en obtener datos del dispositivo:', error.message);
//         throw error;
//     }
// }

// export const updateDataDevice = async (deviceBody, deviceId) => {
//     // console.log(deviceBody);
//     try {
//         const response = await fetch(`apidash/devices/${deviceId}`, {

//             body: JSON.stringify(deviceBody),
//         })

//         if (!response.ok) { throw new Error(`${response.statusText}`); }

//         console.log(await response.json());

//         return response;

//     } catch (error) {
//         console.error('Error en obtener datos del dispositivo:', error.message);
//         throw error;
//     }
// }