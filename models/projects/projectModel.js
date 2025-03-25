import { pool_urbidata } from '../../database/bd_urbicomm.js';

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