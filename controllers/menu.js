//importamos el modelo
const menu = require("../models/menu");
const Menu = require("../models/menu");

//endponit que crea nuevos menus
function addMenu(req, res) {
    const { title, url, order, active } = req.body;

    //inicializamos un nuevo menu (lo hacemos asi por que usamos monggose)
    const menu = new Menu();
    menu.title = title;
    menu.url = url;
    menu.order = order;
    menu.active = active;

    menu.save((err, createMenu) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!createMenu) {
                res.status(404).send({ message: "Error al crear el menu." })
            } else {
                res.status(200).send({ message: "Menu creado correctamente." })
            }
        }

    })
}

//endpoint que recupera todos los menus de la BD
function getMenus(req, res) {
    //obtenemos los menus 
    Menu.find()
        .sort({ order: "asc" })//la propiedad sort se usa para ordenar
        .exec((err, menusStored) => {//exec se usa para ejecutar esta query
            if (err) {
                res.status(500).send({ message: "Error del servidor." })
            } else {
                if (!menusStored) {
                    res.status(404).send({ message: "No se ha encontrado ningun menu." })
                } else {
                    res.status(200).send({ menu: menusStored })
                }
            }
        })

}


module.exports = {
    addMenu
    , getMenus
}