import fetch from 'node-fetch';

// mostrar todos los dispositivos  --> Desde la API de akenza
export const getAllDevices = async (req, res) => {
    try {
        const response = await fetch('https://api.akenza.io/v3/assets/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '3beff9bb15cd6dd7.06e97757-5b92-4967-9437-a0a949c43270'
            },
            body: JSON.stringify({
                organizationId: '2814c3d718dd1526',
            }),
        })

        if (!response.ok) { res.status(404).json({ message: 'Not Found Devices.' }); }

        const data = await response.json();
        res.status(200).json({ message: 'Success', body: data });

    } catch (error) {
        console.log(error);
    }
}


// Simula un objeto req y res básico
const req = {}; // Objeto vacío simulado
const res = {
    status: function (code) {
        this.statusCode = code;
        return this; // Permite el encadenamiento
    },
    json: function (data) {
        console.log(`Status: ${this.statusCode}`);
        console.log('JSON Response:', data);
    },
};

getAllDevices(req, res);


// try {
//     const res = await fetch('https://urbicomm.io/api/audio', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXN1YXJpbyIsImlhdCI6MTczMDk4NTM2NH0.O8bEc4s3I9z0rbpjwv5-VfFaDCTnomrujmHFNVOoeTw',
//         },
//         body: JSON.stringify({
//             command: command,
//             file: file,
//         })
//     });

//     if (!res.ok) {
//         throw new Error('Error en la red');
//     }

//     const data = await res.json();
// } catch (error) {
//     console.error('Error al hacer la solicitud:', error);
// }