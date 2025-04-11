import mysql from "mysql2/promise";
import { config } from 'dotenv';
import path from 'path';

config({ path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env'), });

export const pool_urbicomm = mysql.createPool({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB_URBIDERMIS,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const pool_urbidata = mysql.createPool({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB_URBIDATA,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});