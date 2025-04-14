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

        let query = "SELECT * FROM clients";
        let params = [];

        if (role_id === 2) {

            query = "SELECT * FROM `user_clients` JOIN clients ON user_clients.client_id = clients.id WHERE user_clients.user_id = ?";

            params = [ id ];

        } else if (role_id === 3) {

            query = "SELECT * FROM `user_clients` JOIN clients ON user_clients.client_id = clients.id WHERE user_clients.user_id = ?";

            params = [ id ];
        }

        const [ dataProjects ] = await pool_urbidata.query(query, params);

        if (dataProjects.length === 0) {

            return null;
        }

        return dataProjects;

    } catch (error) {

        console.log(error);
    }
}

export const getDataCompletModel = async (idUser, rolUser) => {
    try {

        let query = `SELECT 
        clients.id AS cliente_id,
        clients.name AS cliente_key,
        clients.description AS cliente_name,
        client_devices.device_id,
        devices.id_reference
        FROM clients
        JOIN client_devices ON clients.id = client_devices.client_id
        JOIN devices ON client_devices.device_id = devices.id_device
        ORDER BY clients.id`;

        let params = [];

        if (rolUser === 2) {

            query = `SELECT 
            clients.id AS cliente_id, 
            clients.name AS cliente_key, 
            clients.description AS cliente_name, 
            client_devices.device_id, 
            devices.id_reference 
            FROM clients 
            JOIN client_devices ON clients.id = client_devices.client_id 
            JOIN devices ON client_devices.device_id = devices.id_device 
            JOIN user_clients ON user_clients.client_id = clients.id WHERE user_clients.user_id = ?
            ORDER BY clients.id;`

            params = [ idUser ];

        } else if (rolUser === 3) {

            query = `SELECT 
            clients.id AS cliente_id, 
            clients.name AS cliente_key, 
            clients.description AS cliente_name, 
            client_devices.device_id, 
            devices.id_reference 
            FROM clients 
            JOIN client_devices ON clients.id = client_devices.client_id 
            JOIN devices ON client_devices.device_id = devices.id_device 
            JOIN user_clients ON user_clients.client_id = clients.id WHERE user_clients.user_id = ?
            ORDER BY clients.id;`

            params = [ idUser ];
        }

        const [ result ] = await pool_urbidata.query(query, [ params ]);

        console.log(result);

        const grouped = [];

        const map = new Map();

        for (const row of result) {
            const clientId = row.cliente_id;

            if (!map.has(clientId)) {
                const group = {
                    cliente_key: row.cliente_key,
                    cliente_name: row.cliente_name,
                    cliente_id: row.cliente_id,
                    devices: []
                };
                map.set(clientId, group);
                grouped.push(group);
            }

            map.get(clientId).devices.push({
                id: row.device_id,
                id_reference: row.id_reference,
            });
        }

        return grouped;

    } catch (error) {

        console.log(error);
    }
}