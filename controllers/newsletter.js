const Newsletter = require("../models/newsletter");

//Funcion para suscribir correos a la newsletter

function suscribeEmail(req, res) {
    const email = req.params.email;
    //creamos una nueva instancia de nuestro modelo
    const newsletter = new Newsletter();

    if (!email) {
        res.status(404).send({ code: 404, message: "El email es obligatorio." })
    } else {
        //formateamos el email a minsculas
        newsletter.email = email.toLowerCase();
        newsletter.save((err, newsletterStored) => {
            if (err) {
                res.status(500).send({ coe: 500, message: "El email ya existe." })
            }
            else {
                if (!newsletterStored) {
                    res.status(404).send({ code: 404, message: "Error al registrar en la newsletter." })
                }
                else {
                    res.status(200).send({ code: 200, message: "Email registrado correctamente." })
                }
            }

        })
    }



}


module.exports = {
    suscribeEmail
};