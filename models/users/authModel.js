import { pool_urbidata } from '../../database/bd_urbicomm.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const updatePassword = async (textPassword) => {

    // insertamos en base de datos el nuevos pass y si todo esta correcto retornamos el pass
    try {
        const sha256Hash = crypto.createHash('sha256').update(textPassword).digest('hex');
        const bcryptHash = await bcrypt.hash(textPassword, 10);
        return bcryptHash
    } catch (error) {
        console.log(error);
    }
}

export const loginUserModel = async (objBody) => {
    try {

        const query = `SELECT users.uuid AS uuid, users.email AS email, roles.id AS rol_id, users.password AS password FROM users 
            JOIN user_roles ON users.uuid = user_roles.user_id 
            JOIN roles on user_roles.role_id = roles.id WHERE email = ?`;

        const [ user ] = await pool_urbidata.query(query, [ objBody.username ]);

        if (user.length === 0 || !await (bcrypt.compare(objBody.userpassword, user[ 0 ].password))) {
            return null;
        }

        return user[ 0 ];

    } catch (error) {

        console.log(error);
    }
}