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

export const formatDeviceData = (type, mode, data = []) => {

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
    }

    else if (type === 'Basic') {

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
    }
}