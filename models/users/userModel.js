// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
import { generateTokkenApi } from '../../services/generateTokken.js';
export const loginUserModel = async (username,userpassword) => {
    const tokken = generateTokkenApi()
    return `desde el model con tokken ${tokken}`;
}