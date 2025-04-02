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
            device_config: filterCustomField(response.customFields, 'Config').JSON
        }
    }

    return responseMap
}