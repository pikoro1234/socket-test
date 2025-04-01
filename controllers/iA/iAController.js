export const getProcessData = async (req, res) => {

    if (req.apiAccess) {

        console.log(`el id que nos viene es user_id ${req.position_user}`);

        // console.log(req);
        // const receivedKey = req.headers.authorization.split(" ")[ 1 ];
        // console.log(receivedKey);
        // const response = await getUserIdModel();
        return res.status(200).json({ menssage: "response desde el controller con api validada" })
    }

    return res.status(401).json({ menssage: "no se pudo validad el token" })

}