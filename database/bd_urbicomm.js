import mysql from "mysql2/promise";
import { config } from 'dotenv';
import path from 'path';

config({ path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env'), });

export const pool_urbicomm = mysql.createPool({
    host: process.env.HOST_DB_URBICOMM,
    user: process.env.USER_DB_URBICOMM,
    password: process.env.PASSWORD_DB_URBICOMM,
    database: process.env.DATABASE_DB_URBICOMM,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// CREATE TABLE `downloads` (
//     `id` int(11) NOT NULL AUTO_INCREMENT,
//     `user_entorno` varchar(20) NOT NULL,
//     `name_file` varchar(20) NOT NULL,
//     `url_file` text DEFAULT NULL,
//     `fecha_file` text DEFAULT NULL,
//     `user_email_file` varchar(100) NOT NULL,
//     `user_nick_file` varchar(100) NOT NULL,
//     `user_ip_file` varchar(100) NOT NULL,
//     `user_idioma` varchar(100) NOT NULL,
//     PRIMARY KEY (`id`)
//   ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci