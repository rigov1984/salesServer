const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "ADuYTBJ099886jjf";

// Funcion que crea el Acces Token
exports.createAccessToken = function (user) {
    const payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        createToken: moment().unix(),//creacion del token la fecha en que se creo en formato unix
        exp: moment().add(3, "hour").unix()//exporacion del token 3 horas
    };
    return jwt.encode(payload, SECRET_KEY); //codifica el objeto payload 
}

// Funcion que crea el refresh Token
exports.createRefreshToken = function (user) {
    const payload = {
        id: user._id,
        exp: moment().add(30, "days").unix()
    };
    return jwt.encode(payload, SECRET_KEY);
}


// Funcion para descodificar el Token
exports.decodeToken = function (token) {
    return jwt.decode(token, SECRET_KEY, true);
}