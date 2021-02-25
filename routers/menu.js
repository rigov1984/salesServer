const express = require("express");
//importamos el controlador
const MenuControler = require("../controllers/menu");
//importamos el midelware 

const md_auth = require("../middlewares/authenticated");
const api = require("./user");


//iniciamos nuestras router de express
api.post("/add-menu", [md_auth.ensureAuth], MenuControler.addMenu);

//estamos exportando api por lo que todas las rutas tambien son importadas.
module.exports = api




