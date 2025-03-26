import { pool_urbidata } from '../../database/bd_urbicomm.js';
import { getRolUser } from '../../helpers/helperUsers.js';

export const createProjectDataModel = async (bodyRequest) => {

    try {

        const { identificador, nombre, pais, ciudad, direccion } = bodyRequest;

        const query = `INSERT INTO clients (name,description,country,city,address) VALUES (?,?,?,?,?)`;

        const [ result ] = await pool_urbidata.query(query, [ identificador, nombre, pais, ciudad, direccion ]);

        return result.affectedRows;

    } catch (error) {

        console.log(error);
        return 0
    }
}

export const getProjectDataModel = async (id, userId) => {

    try {

        const { role_id } = await getRolUser(userId);

        const queryDataProject = `SELECT * FROM clients WHERE id = ?`;

        const [ dataProject ] = await pool_urbidata.query(queryDataProject, [ id ]);

        const querySubCompanies = `SELECT * FROM clients 
            JOIN client_subcompanies ON clients.id = client_subcompanies.parent_client_id 
            WHERE clients.id = ?`;

        const [ subCompanies ] = await pool_urbidata.query(querySubCompanies, [ id ]);

        const queryUsers = `SELECT * FROM user_clients 
            JOIN users ON user_clients.user_id = users.uuid 
            JOIN user_roles ON users.uuid = user_roles.user_id 
            JOIN roles ON user_roles.role_id = roles.id WHERE client_id = ? ${role_id === 2 ? 'AND user_roles.role_id = 3' : ''}`;

        const [ users ] = await pool_urbidata.query(queryUsers, [ id ]);

        return {
            dataProject: dataProject[ 0 ],
            subCompanies: subCompanies,
            users: users
        }

    } catch (error) {
        console.log(error);
    }
}