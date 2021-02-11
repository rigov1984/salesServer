const jwt = require("jwt-simple");
moment = require("moment");

const SECRET_KEY = "ADuYTBJ099886jjf";

//este midelware permite que solo los usuarios loguedos puedan ver a los usuarios
exports.ensureAuth = (req, res, next) => {
    //Si el usuario no envia cabecera(viene null), es decir no ha enviado ningun token
    if (!req.headers.authorization) {
        return res.status(403)
            .send({ message: "La peticion no tiene cabecera de Autenticacion." })
    }
    //formateamos el token (lo cambia a vacio)
    const token = req.headers.authorization.replace(/['"]+/g, "");
    try {
        var payload = jwt.decode(token, SECRET_KEY);
        //la hora actual es igual al momento actual o antes el token ha expirado
        if (payload.exp <= moment.unix) {
            return res.status(404).send({ message: "El token ha expirado" })
        }
    } catch (ex) {
        //console.log(ex);
        return res.status(404).send({ message: "Token invalido" })
    }

    req.user = payload;
    next();// el next da paso a usar la funcion getUsers
};