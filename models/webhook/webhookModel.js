import { pool_urbidata } from '../../database/bd_urbicomm.js';

export const getDiccionaryWarnins = async () => {

    try {

        const query = "SELECT * FROM `warnings`";
        const [ rows ] = await pool_urbidata.query(query);
        return rows;

    } catch (error) {
        console.log(error);
    }
}

export const insertEventsWarningsModel = async (data) => {

    const response_dic_warnins = await getDiccionaryWarnins();

    let topic_hook = data.topic,
        type_device = data.device.name,
        id_device = data.deviceId,
        id_warning = 0,
        msg_warning = "",
        level_warning = "HIGH",
        state_warning = "Open",
        date_device = data.data.timeStamp ? data.data.timeStamp : data.timestamp;

    console.log(data);

    try {

        if (type_device === 'Solana' && topic_hook === "events") {

            const { idevent, value, extradata } = data.data;

            //DOOR
            if (idevent === 'door' && extradata.toLowerCase() === 'open' && value === 1) {

                id_warning = response_dic_warnins[ 0 ].id;
                msg_warning = 'La puerta esta abierta';

            } else if (idevent === 'door' && extradata.toLowerCase() === 'closed' && value === 0) {

                id_warning = response_dic_warnins[ 0 ].id;
                msg_warning = 'La puerta se cerro';
                level_warning = "LOW";
                state_warning = "Closed";
            }

            // WATTER
            if (idevent === 'water_level' && extradata.toLowerCase() === 'low' && value === 0) {

                id_warning = response_dic_warnins[ 1 ].id;
                msg_warning = 'El deposito esta en reserva';

            } else if (idevent === 'water_level' && extradata.toLowerCase() === 'normal' && value === 1) {

                id_warning = response_dic_warnins[ 1 ].id;
                msg_warning = 'El deposito ha sido rellenado';
                level_warning = "LOW";
                state_warning = "Closed";

            }

            // ALARM PV AND PUMP NOT INIT
            if (idevent === 'alarm' && value === 1 && (extradata.startsWith("PUMP is ALARMED,") || extradata.startsWith("PV is ALARMED,"))) {
                id_warning = response_dic_warnins[ 5 ].id;
                msg_warning = extradata;

            } else if (idevent === 'alarm' && value === 0 && (extradata.startsWith("PUMP is NORMAL,") || extradata.startsWith("PV is NORMAL,"))) {
                id_warning = response_dic_warnins[ 5 ].id;
                msg_warning = extradata;
                level_warning = "LOW";
                state_warning = "Closed";
            }

            // ALARM BATTERY
            if (idevent === 'alarm' && value === 1 && extradata.startsWith("Battery is DEAD,")) {
                id_warning = response_dic_warnins[ 2 ].id;
                msg_warning = extradata;

            } else if (idevent === 'alarm' && value === 0 && extradata.startsWith("Battery is NORMAL,")) {
                id_warning = response_dic_warnins[ 2 ].id;
                msg_warning = extradata;
                level_warning = "LOW";
                state_warning = "Closed";
            }

            // SOIL MOISTURE
            if (idevent === 'soil_moisture' && value === 0) {
                id_warning = response_dic_warnins[ 7 ].id;
                msg_warning = `la humedad esta por debajo del umbral ${extradata}`;

            } else if (idevent === 'soil_moisture' && value === 1) {
                id_warning = response_dic_warnins[ 7 ].id;
                msg_warning = `la humedad actual es normal ${extradata}`;
                level_warning = "LOW";
                state_warning = "Closed";
            }

            // IMPACT
            if (idevent === 'impact' && extradata.toLowerCase().startsWith("shake")) {
                id_warning = response_dic_warnins[ 3 ].id;
                msg_warning = `Agitación fuerte detectada ${extradata}`;

            } else if (idevent === 'impact' && extradata.toLowerCase().startsWith("acc")) {
                id_warning = response_dic_warnins[ 3 ].id;
                msg_warning = `${extradata}`;
                level_warning = "LOW";
                state_warning = "Closed";
            }

            // WAKE
            if (idevent === 'wake') {
                id_warning = response_dic_warnins[ 6 ].id;
                msg_warning = `${extradata}`;
                level_warning = "LOW";
                state_warning = "Closed";
            }

            // PUMP
            if (idevent === 'pump') {
                id_warning = response_dic_warnins[ 4 ].id;
                msg_warning = `${extradata}`;
                level_warning = "LOW";
                state_warning = "Closed";
            }

            // WATTER SENSOR FISIC/HARDWARE
            if(idevent === 'water_level_sensor_detected'){
                id_warning = response_dic_warÑnins[ 4 ].id;
                msg_warning = `${extradata}`;
                level_warning = value === 0 ? level_warning : 'LOW';
                state_warning = value === 0 ? state_warning : "Closed";
            }

            console.log(type_device);
            console.log(id_device);
            console.log(id_warning);
            console.log(msg_warning);
            console.log(level_warning);
            console.log(state_warning);
            console.log(date_device);

            const query = "INSERT INTO `devices_warnings`(`type_device`, `id_device`, `id_warning`, `msg_warning`, `level_warning`, `state_warning`, `date_device`) VALUES (?,?,?,?,?,?,?)";

            const params = [
                type_device,
                id_device,
                id_warning,
                msg_warning,
                level_warning,
                state_warning,
                date_device ];

            const [ result ] = await pool_urbidata.query(query, params);
            console.log(result);
        }

    } catch (error) {

        console.log(error);
        return 0;
    }
}