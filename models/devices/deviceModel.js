import { header_api_key_extern,uri_get_assets_extern } from '../../no-trackin.js';
import { customFetch } from '../../services/custom.js';
export const getDevicesModel = (workspaces) => {

    try {

        const method = 'POST'
        const response = customFetch(method, uri_get_assets_extern, header_api_key_extern, workspaces);
        return response;

    } catch (error) {

        console.log(error);
    }
}