import { loginUserModel } from '../../models/users/userModel.js';

export const loginUser = async (req, res) => {
    try {

        if (!req.body.username || req.body.username === '') {
            return res.status(404).json({ message: 'User/Password Required' });
        }

        if (!req.body.userpassword || req.body.userpassword === '') {
            return res.status(404).json({ message: 'User/Password Required' });
        }

        const response = await loginUserModel(username,userpassword);

        console.log(response);

        return res.status(200).json({ message: response });

    } catch (error) {

        return res.status(500).json({ message: 'Error usuario no valido' });
    }
}