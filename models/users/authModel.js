import { pool_urbidata } from '../../database/bd_urbicomm.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const updatePassword = (textPassword) => {
    // insertamos en base de datos el nuevos pass y si todo esta correcto retornamos el pass
    try {
        const sha256Hash = crypto.createHash('sha256').update(textPassword).digest('hex');
    } catch (error) {
        console.log(error);
    }
}

export const loginUserModel = async (objBody) => {
    try {

        const [ user ] = await pool_urbidata.query('SELECT * FROM users WHERE email = ?', [ objBody.username ]);

        if (user.length === 0 || !await (bcrypt.compare(objBody.userpassword, user[ 0 ].password))) {
            return null;
        }

        return user[0];

    } catch (error) {

        console.log(error);
    }
}