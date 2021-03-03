const express = require("express");
//importamos el controlador
const MenuControler = require("../controllers/menu");
//importamos el midelware 
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

//const api = require("./user");


//iniciamos nuestras router de express
api.post("/add-menu", [md_auth.ensureAuth], MenuControler.addMenu);
api.get("/get-menus", MenuControler.getMenus);
api.put("/update-menu/:id", [md_auth.ensureAuth], MenuControler.updateMenu);
api.put("/activate-menu/:id", [md_auth.ensureAuth], MenuControler.activateMenu);
api.delete("/delete-menu/:id", [md_auth.ensureAuth], MenuControler.deleteMenu);
//estamos exportando api por lo que todas las rutas tambien son importadas.
module.exports = api




