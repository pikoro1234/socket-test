import { customFetch } from '../services/custom.js';
import { uri_get_workspace_extern, header_api_key_extern } from '../no-trackin.js';

export const filterCustomField = (arrayCustomField, keySelect) => {
    return arrayCustomField.find(field => field.meta?.name === keySelect) || {};
};

export const getNoFilterWorkSpace = async () => {

    try {

        const data = await customFetch('GET', uri_get_workspace_extern, header_api_key_extern, {})

        return data.data.content.map(({ id }) => (id));

    } catch (error) {

        console.log("Error al obtener los workspace");
        console.log(error);
    }
}

export const mappedStructDevice = (typeDevice, response) => {

    try {

        let responseMap = {}

        if (typeDevice === 'Solana') {

            responseMap = {
                device_id_reference: response.id,
                device_id: response.deviceId,
                device_name_type: response.name,
                device_description: response.description,
                device_workspace_dashboard: response.workspaceId,
                device_created: response.created,
                device_updated: response.updated,
                device_online: response.online,
                device_workspace_data: filterCustomField(response.customFields, 'workspace').STRING,
                device_zona: filterCustomField(response.customFields, 'Timezone').STRING,
                device_coordenadas: filterCustomField(response.customFields, 'Coordenadas').GPS_COORDINATES,
                device_tags: response.tags,
                device_params: filterCustomField(response.customFields, 'Params').JSON,
                device_config: filterCustomField(response.customFields, 'Config').JSON
            }
        }

        if (typeDevice === 'Franklin') {

            responseMap = {
                device_id_reference: response.id,
                device_id: response.deviceId,
                device_name_type: response.name,
                device_description: response.description,
                device_workspace_dashboard: response.workspaceId,
                device_created: response.created,
                device_updated: response.updated,
                device_online: response.online,
                device_workspace_data: filterCustomField(response.customFields, 'workspace').STRING,
                device_zona: filterCustomField(response.customFields, 'Timezone').STRING,
                device_coordenadas: filterCustomField(response.customFields, 'Coordenadas').GPS_COORDINATES,
                device_tags: response.tags,
            }
        }

        if (typeDevice === 'Basic') {

            responseMap = {
                device_id_reference: response.id,
                device_id: response.deviceId,
                device_name_type: response.name,
                device_description: response.description,
                device_workspace_dashboard: response.workspaceId,
                device_created: response.created,
                device_updated: response.updated,
                device_online: response.online,
                device_workspace_data: filterCustomField(response.customFields, 'workspace').STRING,
                device_zona: filterCustomField(response.customFields, 'Timezone').STRING,
                device_coordenadas: filterCustomField(response.customFields, 'Coordenadas').GPS_COORDINATES,
                device_tags: response.tags,
                device_config: filterCustomField(response.customFields, 'Config').JSON
            }
        }

        return responseMap

    } catch (error) {

        console.log(error);
        return { message: "Error en el mapeo de datos" }
    }
}

export const formatDeviceData = (type, data = []) => {

    if (type === 'Solana') {

        const arrays_solana = {
            array_humedad: [],
            array_temperatura: [],
            array_bateria: [],
            array_puerta: [],
            array_deposito: [],
            array_riegos: [],
        }

        data.forEach(({ _measurement: measurement, _field: field, _time: fecha, _value: valor }) => {

            const response_item = { fecha, valor, field }

            if (measurement === 'status' && field === 'humedad') arrays_solana.array_humedad.push(response_item);
            else if (measurement === 'status' && field === 'temperatura') arrays_solana.array_temperatura.push(response_item);
            else if (measurement === 'status' && field === 'vBatt') arrays_solana.array_bateria.push(response_item);
            else if (measurement === 'status' && field === 'puerta') arrays_solana.array_puerta.push(response_item);
            else if (measurement === 'status' && field === 'agua') arrays_solana.array_deposito.push(response_item);
            else if (measurement === 'irrigations' && field === 'duration') arrays_solana.array_riegos.push(response_item);
        });

        return arrays_solana;

    } else if (type === 'Basic') {

        const arrays_basic = {
            array_power1: [],
            array_power2: [],
            array_power3: [],
            array_magnitude: [],
            array_temperatura: [],
        }

        data.forEach(({ _measurement: measurement, _field: field, _time: fecha, _value: valor }) => {

            const response_item = { fecha, valor, field }

            if (measurement === 'charger1' && field === 'power1') arrays_basic.array_power1.push(response_item);
            else if (measurement === 'charger2' && field === 'power2') arrays_basic.array_power2.push(response_item);
            else if (measurement === 'charger3' && field === 'power3') arrays_basic.array_power3.push(response_item);
            else if (measurement === 'status_impact' && field === 'magnitude') arrays_basic.array_magnitude.push(response_item);
            else if (measurement === 'status_temp' && field === 'temperatura') arrays_basic.array_temperatura.push(response_item);
        });

        return arrays_basic;

    } else {

        const arrays_franklin = {
            array_pm1: [],
            array_pm2: [],
            array_pm4: [],
            array_pm10: [],
            array_temperatura: [],
            array_humedad: [],
            array_co2: [],
            array_nox: [],
            array_voc: [],
            array_ina219_current: [],
            array_ina219_power: [],
            array_ina260_current: [],
            array_ina260_power: [],
        }

        data.forEach(({ _measurement: measurement, _field: field, _time: fecha, _value: valor }) => {

            const response_item = { fecha, valor, field }

            if (measurement === 'airquality' && field === 'pm1') arrays_franklin.array_pm1.push(response_item);
            else if (measurement === 'airquality' && field === 'pm2') arrays_franklin.array_pm2.push(response_item);
            else if (measurement === 'airquality' && field === 'pm4') arrays_franklin.array_pm4.push(response_item);
            else if (measurement === 'airquality' && field === 'pm10') arrays_franklin.array_pm10.push(response_item);
            else if (measurement === 'airquality' && field === 'temperatura') arrays_franklin.array_temperatura.push(response_item);
            else if (measurement === 'airquality' && field === 'humedad') arrays_franklin.array_humedad.push(response_item);
            else if (measurement === 'airquality' && field === 'co2') arrays_franklin.array_co2.push(response_item);
            else if (measurement === 'airquality' && field === 'nox') arrays_franklin.array_nox.push(response_item);
            else if (measurement === 'airquality' && field === 'voc') arrays_franklin.array_voc.push(response_item);
            else if (measurement === 'sensors_data' && field === 'ina219_current') arrays_franklin.array_ina219_current.push(response_item);
            else if (measurement === 'sensors_data' && field === 'ina219_power') arrays_franklin.array_ina219_power.push(response_item);
            else if (measurement === 'sensors_data' && field === 'ina260_current') arrays_franklin.array_ina260_current.push(response_item);
            else if (measurement === 'sensors_data' && field === 'ina260_power') arrays_franklin.array_ina260_power.push(response_item);
        });

        return arrays_franklin;
    }
}