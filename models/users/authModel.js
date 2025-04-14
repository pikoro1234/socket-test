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

export const generateKeyCommTempUserModel = async (idUser) => {

    try {

        const textApiKey = `mqtt_channel_id_${crypto.randomBytes(32).toString("hex")}`;
        const hashApiKey = await bcrypt.hash(textApiKey, 10);
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        const query = "INSERT INTO user_mqtt_channels (user_id, mqtt_channel_id, expires_at) VALUES (?, ?, ?)";
        const [ result ] = await pool_urbidata.query(query, [ idUser, hashApiKey, expiresAt ]);

        if (result.affectedRows === 0) {

            return { message: textApiKey, success: false }
        }

        return { message: textApiKey, success: true }

    } catch (error) {

        console.log(error);
    }
}
export const deleteExpiredKeyCommTempUserModel = async (textKey) => {
    try {

        const query = "DELETE FROM user_mqtt_channels WHERE expires_at < NOW()";
        const [ rows ] = await pool_urbidata.query(query);
        return rows

    } catch (error) {

        console.log(error);
    }
}

export const deleteKeyCommTempUserModel = async (textKey) => {

    try {

        const [ rows ] = await pool_urbidata.query("SELECT id, mqtt_channel_id FROM user_mqtt_channels");

        for (const row of rows) {
            const match = await bcrypt.compare(textKey, row.mqtt_channel_id);

            if (match) {
                await pool_urbidata.query("DELETE FROM user_mqtt_channels WHERE id = ?", [ row.id ]);
                return { success: true, message: "Canal eliminado" };
            }
        }

        return { success: false, message: "No se encontró el canal para eliminar" };

    } catch (error) {

        console.error("Error al eliminar el canal MQTT:", error);
        return { success: false, message: "Error interno del servidor" };
    }
}