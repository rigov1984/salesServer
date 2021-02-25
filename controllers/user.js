const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");
const { param } = require("../routers/user");
const { exists } = require("../models/user");
const user = require("../models/user");
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
    User.find().then(users => {
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
    User.find({ active: query.active }).then(users => {
        if (!users) {
            res.status(404).send({ message: "No se ha encontrado ningun usuario." })
        } else {
            res.status(200).send({ users });
        }
    })
}

function uploadAvatar(req, res) {
    const params = req.params;
    //Comprobamos si el usuario existe
    User.findById({ _id: params.id }, (err, userData) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!userData) {
                res.status(500).send({ message: "No se ha encontrado ningun usuario." });
            } else {
                //si el usuario existe recuperamos la imagen
                let user = userData;
                if (req.files) {
                    let filePath = req.files.avatar.path;
                    let fileSplit = filePath.split("/");
                    let fileName = fileSplit[2];

                    let extSplit = fileName.split(".");
                    let fileExt = extSplit[1];
                    //Comprobamos la extension
                    if (fileExt !== "png" && fileExt !== "jpg") {
                        res.status(400).send({ message: "La extension de la imagen no es valida.(solo se admiten .png y .jpg)" });
                    } else {
                        //Actualizamos la variable user y le agregamos la imagen
                        user.avatar = fileName;
                        //updatea al usuario con los datos que tenga
                        User.findByIdAndUpdate({ _id: params.id }, user, (err, userResult) => {
                            if (err) {
                                res.status(500).send({ message: "Error del servidor." })
                            } else {
                                if (!userResult) {
                                    res.status(404).send({ message: "No se ha encontrado ningun usuario." });
                                } else {
                                    //res.status(200).send({ user: userResult });
                                    res.status(200).send({ avatarName: fileName });

                                }
                            }
                        })
                    }
                }
            }
        }
    })

}

function getAvatar(req, res) {
    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/" + avatarName;
    //filesistem
    fs.exists(filePath, exists => {
        if (!exists) {
            res.status(404).send({ message: "El avatar que busca no existe." })
        } else {
            //enviamos la imagen
            res.sendFile(path.resolve(filePath));
        }
    })

}

//updatear los datos del usuario en la bd
//la funcion es asincrona para que espere que acabe de encriptar la contraseña para updatear al usuario. 
async function updateUser(req, res) {
    //recuperamos los datos del usuario mediante el body
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const params = req.params;//conseguimos el id que le estamos enviando por parametro
    //encriptamos la contraseña al actualizarla
    if (userData.password) {
        await bcrypt.hash(userData.password, null, null, (err, hash) => {
            if (err) {
                res.status(500).send({ message: "Error al encriptar la contraseña." })
            } else {
                //el hash es la contraseña ya encriptada.
                userData.password = hash;
            }
        });
    };

    User.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
        if (err) {
            res.status(500).send({ message: "Error de servidor." });
        } else {
            if (!userUpdate) {
                res.status(404).send({ message: "No se ha encontrado ningun usuario." });
            } else {
                res.status(200).send({ message: "Usuario actualizado correctamente." })
            }
        }
    })

}

function activateUser(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    //buscamos al modelo User
    User.findByIdAndUpdate(id, { active }, (err, userStored) => {
        if (err) {
            res.status(500).send({ message: "Error de servidor." });
        } else {
            if (!userStored) {
                res.status(404).send({ message: "No se ha encontrado el usuario." });
            } else {
                if (active === true) {
                    res.status(200).send({ message: "Usuario activado Correctamente." });
                } else {
                    res.status(200).send({ message: "Usuario desactivado Correctamente." });
                }
            }
        }
    });
}

function deleteUser(req, res) {
    const { id } = req.params;
    user.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            //si no se encuentra el usuario
            if (!userDeleted) {
                res.status(404).send({ message: "Usuario no encontrado" })
            } else {
                res.status(200).send({ message: "El usuario ha sido eliminado correctamente." })
            }
        }
    })

}

function signUpAdmin(req, res) {
    //inicializamos un nuevo usuario
    const user = new User();

    const { name, lastname, email, role, password } = req.body;
    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = role;
    user.active = true;

    if (!password) {
        res.status(500).send({ message: "La contraseña es obligatoria." })
    } else {
        bcrypt.hash(password, null, null, (err, hash) => {
            if (err) {
                res.status(500).send({ message: "Error al encriptar la contraseña." })
            } else {
                user.password = hash;
                //creamos el usuario
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: "El usuario ya existe." })
                    } else {
                        if (!userStored) {
                            res.status(500).send({ message: "Error al crear el nuevo usuario." });
                        } else {
                            //res.status(200).send({ user: userStored });
                            res.status(200).send({ message: "Usuario creado correctamente." });

                        }
                    }
                })
            }
        });
    }

}

module.exports = {
    signUp
    , signIn
    , getUsers
    , getUsersActive
    , uploadAvatar
    , getAvatar
    , updateUser
    , activateUser
    , deleteUser
    , signUpAdmin
};

