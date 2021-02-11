const jwt = require("../services/jwt");
const moment = require("moment");
const User = require("../models/user");


//chekea si el toca ha expirado desde el servidor para darle mas seguridad.
//si retorna false el token no ha caducado
function willExpiredToken(token) {
    const { exp } = jwt.decodeToken(token);
    const currentDate = moment().unix();//fecha actual en Unix

    //si la fecha ctual es mayor a exp,el token ha caducado
    if (currentDate > exp) {
        return true;
    }
    return false;
}

//Funcion que se encarga de refrescar el acces Token
function refreshAccessToken(req, res) {
    //Recuperamos el refreshToken
    //si el refreshToken es correcto refrescamos el access token
    const { refreshToken } = req.body;
    const isTokenExpired = willExpiredToken(refreshToken);
    //si isTokkenExpired es true ha caducado
    if (isTokenExpired) {
        res.status(404).send({ message: "El refreshToken ha expirado." })
    } else {
        const { id } = jwt.decodeToken(refreshToken);
        User.findOne({ _id: id }, (err, userStored) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor." })
            } else {
                if (!userStored) {
                    res.status(404).send({ message: "Usuario no encontrado." })
                } else {
                    //Retornamos el nuevo token
                    res.status(200).send({
                        accessToken: jwt.createAccessToken(userStored),
                        refreshToken: refreshToken
                    })
                }
            }
        })
    }

}

module.exports = {
    refreshAccessToken
}

