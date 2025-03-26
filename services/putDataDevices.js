import { fetchDataDevice, updateDataDevice } from '../models/deviceModel.js';

export const configUpdateSolana = async (bodyConfig) => {
    const description = bodyConfig.generic_description === '' ? 'description no defined' : bodyConfig.generic_description;
    const generic_rain_threshold = bodyConfig.generic_rain_threshold === 0 ? 10 : bodyConfig.generic_rain_threshold; // milimetros de lluvia -- mm
    const generic_rain_probability_threshold = bodyConfig.generic_rain_probability_threshold === 0 ? 50 : bodyConfig.generic_rain_probability_threshold; // porcentaje de lluvia -- %
    const generic_refresh_params_period = bodyConfig.generic_refresh_params_period === 0 ? 43200 : bodyConfig.generic_refresh_params_period; // volver a pedir los parametros del servidor -- seg.
    const generic_max_volume_of_a_single_irrigation = bodyConfig.generic_max_volume_of_a_single_irrigation === 0 ? 2000 : bodyConfig.generic_max_volume_of_a_single_irrigation; // litros de agua que lanza en el riego -- ml.
    const generic_min_period_between_irrigations = bodyConfig.generic_min_period_between_irrigations === 0 ? 43200 : bodyConfig.generic_min_period_between_irrigations; // periodo de tiempo que deberia pasar despues de un riego -- seg.
    const generic_max_duration_of_a_single_irrigation = bodyConfig.generic_max_duration_of_a_single_irrigation === 0 ? 60 : bodyConfig.generic_max_duration_of_a_single_irrigation; // duracion maxima de un riego -- seg.

    const generic_modes_irrigation = bodyConfig.generic_modes_irrigation === 0 ? '2' : bodyConfig.generic_modes_irrigation; // modo de accion del riego 2 == SOIL MOISTURE
    const mod_mod_soil_moisture_low_th = bodyConfig.mod_mod_soil_moisture_low_th === 0 ? 15 : bodyConfig.mod_mod_soil_moisture_low_th; // umbral que debe cumplirse para que se realize un riego -- % MODO SOIL MOISTURE
    const mod_mod_periodic_pump = bodyConfig.mod_mod_periodic_pump === 0 ? 100 : bodyConfig.mod_mod_periodic_pump; // tiempo que debe durar un riego riego -- seg. MODO PERIODIC
    const mod_mod_calendar_items = bodyConfig.mod_mod_calendar_items.legth === 0 ? [] : bodyConfig.mod_mod_calendar_items; // array de dias de riego -- MODO CALENDAR

    const response = await fetchDataDevice(bodyConfig.iDevice);
    response.description = description;
    response.customFields.map(element => {
        if (element.meta.name === 'Params') {
            element.JSON.rain_mmph = generic_rain_threshold
            element.JSON.rain_threshold_mmph = generic_rain_probability_threshold
            element.JSON.advanced.svr_get_params_period_s = generic_refresh_params_period
            element.JSON.periodic.max_vol_ml = generic_max_volume_of_a_single_irrigation
            element.JSON.advanced.sm_pump_min_period_s = generic_min_period_between_irrigations
            element.JSON.periodic.max_duration_s = generic_max_duration_of_a_single_irrigation
            element.JSON.mode = generic_modes_irrigation
            element.JSON.moisture_low_th = mod_mod_soil_moisture_low_th
            element.JSON.periodic.pump_period_s = mod_mod_periodic_pump
            element.JSON.calendar = mod_mod_calendar_items
        }
    });

    const device_modif = {
        "id": response.id,
        "deviceId": response.deviceId,
        "name": response.name,
        "description": response.description,
        "properties": {},
        "connectivity": "MQTT",
        "onlineTimeout": 86400,
        "workspaceId": response.workspaceId,
        "organizationId": response.organizationId,
        "dataFlowId": response.dataFlowId,
        "integration": null,
        "customFields": response.customFields,
        "tags": response.tags
    }

    return await updateDataDevice(device_modif, response.id);
}