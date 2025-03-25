import { pool_urbidata } from '../../database/bd_urbicomm.js';
import { getRolUser } from '../../helpers/helperUsers.js';

export const getUserDataModel = async (userId) => {

    try {

        const [ dataUser ] = await pool_urbidata.query("SELECT * FROM `users` JOIN user_roles ON users.uuid = user_roles.user_id WHERE uuid = ?", [ userId ]);

        if (dataUser.length === 0) {
            return null;
        }

        return dataUser[ 0 ];

    } catch (error) {

        console.log(error);
    }
}

export const getUserProjectsModel = async (userId) => {

    try {

        const { role_id } = await getRolUser(userId);

        let query = "";
        let params = [];

        if (role_id === 1) {

            query = "SELECT * FROM clients"

        } else {

            query = "SELECT * FROM `user_clients` JOIN clients ON user_clients.client_id = clients.id WHERE user_clients.user_id = ?"
            params = [ userId ]
        }

        const [ dataProjects ] = await pool_urbidata.query(query, params);

        if (dataProjects.length === 0) {

            return null;
        }

        return dataProjects

    } catch (error) {

        console.log(error);
    }
}