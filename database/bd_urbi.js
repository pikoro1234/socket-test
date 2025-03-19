import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "pht549Afin",
    database: "urbidermis_data",
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