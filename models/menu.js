const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//esquema son las propiedades que tiene un modelo(en este caso el menu)
const MenuSchema = Schema({
    title: String,
    url: String,
    order: Number,
    active: Boolean
});

module.exports = mongoose.model("Menu", MenuSchema);