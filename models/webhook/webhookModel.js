import { pool_urbidata } from '../../database/bd_urbicomm.js';

export const insertEventsModel = async (data) => {

    const diccionary_warnings = [
        { id: 2, value: "Estado Puerta" },
        { id: 3, value: "Impacto" },
        { id: 5, value: "Estado Deposito" },
        { id: 6, value: "Estado Bateria" },
        { id: 7, value: "Riego" },
        { id: 8, value: "Reinicio" }

    ]

    let id_warning = 0, type_warning = '', state_warning = '', date_device = '';

    try {

        const idSensor = data.device.deviceId;

        if (data.device.name === 'Solana') {

            const { idevent, value, extradata, vBatt } = data.data

            if (idevent === 'door' && extradata.toLowerCase() === 'open') {

                id_warning = diccionary_warnings[ 0 ].id

                type_warning = diccionary_warnings[ 0 ].value

                state_warning = 'Activated'

                date_device = data.data.timeStamp
            }

            else if (idevent === 'water_level' && extradata === 'Low') {

                id_warning = diccionary_warnings[ 2 ].id

                type_warning = diccionary_warnings[ 2 ].value

                state_warning = 'Activated'

                date_device = data.data.timeStamp
            }

            else if (vBatt < 11) {

                id_warning = diccionary_warnings[ 3 ].id

                type_warning = diccionary_warnings[ 3 ].value

                state_warning = 'Activated'

                date_device = data.data.tiempo
            }

            if (id_warning !== 0 && type_warning !== '' && state_warning !== '' && date_device !== '') {

                console.log(data);

                const sql_insert = "INSERT INTO`devices_warnings`(`id_device`, `id_warning`, `type_warning`, `state`, `date_device`) VALUES(?,?,?,?,?)";

                const [ result ] = await pool_urbidata.query(sql_insert, [ idSensor, id_warning, type_warning, state_warning, date_device ]);

                return result.affectedRows;
            }
        }

    } catch (error) {

        console.log(error);
        return 0;
    }
}