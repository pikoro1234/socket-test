import fs from 'fs'
import { uid } from 'uid';
export function appendInFile(fichero, name, hora, dias) {
    fs.readFile(fichero, 'utf-8', (err, data) => {
        if (err) {
            console.log("Error al leer el fichero", err);
            return;
        }

        const songFile = JSON.parse(data);
        const newMusic = {
            id: uid(16),
            name,
            hora,
            dias
        };
        songFile.push(newMusic);
        const updateFile = JSON.stringify(songFile, null, 2)
        fs.writeFile(fichero, updateFile, 'utf-8', (writeErr) => {
            if (writeErr) {
                console.log("errro al modificar el fichero", writeErr);
                return;
            }
            console.log("se actualizo el fichero");
        })

    })
}