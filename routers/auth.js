const express = require("express");
const AuthController = require("../controllers/auth");

//Empieza a generar rutas
const api = express.Router();

// endpoint para refrescar el token 
//api de tipo post, pasamos la url y llamamos la funcion refreshAccessToken
api.post("/refresh-access-token", AuthController.refreshAccessToken);

module.exports = api;