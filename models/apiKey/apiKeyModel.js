import { pool_urbidata } from '../../database/bd_urbicomm.js';

export const insertApiKeyModelStaticPlatforms = async (app, hashApiKey) => {

    try {

        const query = "INSERT INTO `user_tokens`(`user_client`, `token`,`validate`) VALUES (?,?,?)";

        const [ result ] = await pool_urbidata.query(query, [ app, hashApiKey, true ])

        return result.affectedRows;

    } catch (error) {

    }
}