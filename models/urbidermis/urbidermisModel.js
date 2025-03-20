import { pool_urbicomm } from "../../database/bd_urbicomm.js";

export const insertFilesModel = async (values) => {
    try {
        const { user_entorno, name_file, url_file, fecha_file, user_email_file, user_nick_file, user_ip_file, user_idioma } = values;
        const sql = `
            INSERT INTO downloads (user_entorno, name_file, url_file, fecha_file, user_email_file, user_nick_file, user_ip_file, user_idioma)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const values_insert = [ user_entorno, name_file, url_file, fecha_file, user_email_file, user_nick_file, user_ip_file, user_idioma ];
        const [ result ] = await pool_urbicomm.query(sql, values_insert);
        return result;

    } catch (error) {
        throw error;
    }
}