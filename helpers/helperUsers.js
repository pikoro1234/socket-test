import { pool_urbidata } from '../database/bd_urbicomm.js';

export const helperGetRolUser = async (userId) => {

    try {

        const [ dataRol ] = await pool_urbidata.query("SELECT * FROM `user_roles` WHERE user_id = ?", [ userId ]);

        if (dataRol.length === 0) {
            return null;
        }

        return dataRol[ 0 ];

    } catch (error) {

        console.log(error);
    }
}

export const helperGetClientUser = async (userId) => {

    try {

        const [ dataClient ] = await pool_urbidata.query("SELECT * FROM `user_clients` WHERE user_id = ?", [ userId ]);

        if (dataClient.length === 0) {
            return null;
        }

        return dataClient[ 0 ];

    } catch (error) {

        console.log(error);
    }
}