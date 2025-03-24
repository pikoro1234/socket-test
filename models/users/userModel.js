import { pool_urbidata } from '../../database/bd_urbicomm.js';

export const getUserDataModel = async (userId) => {

    try {
        const [ dataUser ] = await pool_urbidata.query("SELECT * FROM `users` WHERE uuid = ?", [ userId ]);

        if (dataUser.length === 0) {
            return null;
        }

        return dataUser[ 0 ];

    } catch (error) {

        console.log(error);
    }
}