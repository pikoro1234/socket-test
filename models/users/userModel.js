import { pool_urbidata } from '../../database/bd_urbicomm.js';

export const getUserDataModel = async (userId) => {

    try {

        const query = `SELECT 
        users.name,
        users.surname,
        users.email,
        users.language,
        users.phone,
        users.country,
        users.city,
        users.address,
        users.zip_code,
        user_roles.role_id
        FROM users 
        JOIN user_roles ON users.uuid = user_roles.user_id 
        WHERE uuid = ?`;

        const [ dataUser ] = await pool_urbidata.query(query, [ userId ]);

        if (dataUser.length === 0) {
            return null;
        }

        return dataUser[ 0 ];

    } catch (error) {

        console.log(error);
    }
}

export const getUserProjectsModel = async (reqOptions) => {

    try {

        const id = reqOptions.apiAccess !== undefined ? reqOptions.position_user : reqOptions.user.id
        const role_id = reqOptions.apiAccess !== undefined ? reqOptions.position_rol.role_id : reqOptions.user.role_id

        let query = "";
        let params = [];

        if (role_id === 1) {

            query = "SELECT * FROM clients"

        } else {

            query = "SELECT * FROM `user_clients` JOIN clients ON user_clients.client_id = clients.id WHERE user_clients.user_id = ?"
            params = [ id ]
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