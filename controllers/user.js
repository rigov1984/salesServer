const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");
const { param } = require("../routers/user");
//const user = require("../models/user");

function signUp(req, res) {
    const user = new User();

    const { name, lastname, email, password, repeatPassword } = req.body;
    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = "Admin";
    user.active = false;

    if (!password || !repeatPassword) {
        res.status(404).send({ message: "Las contraseñas son obligatorias." });
    } else {
        if (password !== repeatPassword) {
            res.status(404).send({ message: "Las contraseñas no son iguales." });
        } else {
            bcrypt.hash(password, null, null, function (err, hash) {
                if (err) {
                    res.status(500).send({ message: "Error al encriptar la contraseña." })
                } else {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if (err) {
                            res.status(500).send({ message: "El usuario ya existe." });
                        } else {
                            if (!userStored) {
                                res.status(404).send({ message: "Error al crear el usuario" });
                            } else {
                                res.status(200).send({ user: userStored });
                            }
                        }
                    })
                }
            })
        }
    }
}


//el .send es lo que se envia al front
function signIn(req, res) {

    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    //uso de mongoose ..en el userStored se guarda el usuario si lo encuentra
    User.findOne({ email }, (err, userStored) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!userStored) {
                res.status(404).send({ message: "Usuario no encontrado." });
            } else {
                //el check se usa en el caso de ser valido y el bcrip esta haciendo la comparacion de las contraseñas(compara una contraseña sin encriptar contra una encriptada.)
                bcrypt.compare(password, userStored.password, (err, check) => {
                    if (err) {
                        res.status(500).send({ message: "Error de servidor." })
                    } else if (!check) {
                        res.status(404).send({ message: "La contraseña es incorrecta." })
                    } else {
                        if (!userStored.active) {
                            res.status(200).send({ code: 200, message: "El usuario no se ha activado." })
                        } else {
                            res.status(200).send({
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            })
                        }
                    }
                })
            }
        }
    })
}

function getUsers(req, res) {
    //nos devuelve todos los usuarios de la base de datos
    user.find().then(users => {
        if (!users) {
            res.status(404).send({ message: "No se ha encontrado ningun usuario." })
        } else {
            res.status(200).send({ users });
        }
    })
}

function getUsersActive(req, res) {
    const query = req.query; //obtenemos el query del request

    //nos devuelve todos los usuarios activos de la base de datos
    user.find({ active: query.active }).then(users => {
        if (!users) {
            res.status(404).send({ message: "No se ha encontrado ningun usuario." })
        } else {
            res.status(200).send({ users });
        }
    })
}

function uploadAvatar(req, res) {
    const params = req.params;

    User.findById({ _id: params.id }, (err, userData) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor" });
        }
    })

}

module.exports = {
    signUp
    , signIn
    , getUsers
    , getUsersActive
    , uploadAvatar
};

