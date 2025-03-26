import { customFetch } from '../services/custom.js';
import { uri_get_workspace_extern, header_api_key_extern } from '../no-trackin.js';

export const getNoFilterWorkSpace = async () => {

    try {

        const data = await customFetch('GET', uri_get_workspace_extern, header_api_key_extern, {})

        return data.data.content.map(({ id, name }) => (id));

    } catch (error) {

        console.log("Error al obtener los workspace");
        console.log(error);
    }
}