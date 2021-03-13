const express = require("express");
const ProductController = require("../controllers/product");

const md_auth = require("../middlewares/authenticated");


const api = express.Router();

api.post("/add-product", [md_auth.ensureAuth], ProductController.addProduct);
api.get("/get-products", ProductController.getProducts);
api.delete("/delete-product/:id", [md_auth.ensureAuth], ProductController.deleteProduct);
api.put("/update-product/:id", [md_auth.ensureAuth], ProductController.updateProduct);

module.exports = api;