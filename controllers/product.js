const Product = require("../models/product");

//crear nuevos productos
function addProduct(req, res) {
    const body = req.body;
    const product = new Product(body);

    product.order = 1000;//añadimos el curso en la parte de abajo

    product.save((err, productStored) => {
        if (err) {
            res.status(400).send({ code: 400, message: "El curso que estas creando ya existe." });
        } else {
            if (!productStored) {
                res.status(400).send({ code: 400, message: "No se ha podido crear el producto." })
            } else {
                res.status(200).send({ code: 200, message: "Producto creado correctamente." })
            }
        }
    })

}

function getProducts(req, res) {
    Product.find()
        .sort({ order: "asc" })
        .exec((err, productStored) => {
            if (err) {
                res.status(500).send({ code: 500, message: "Error del servidor." })
            } else {
                if (!productStored) {
                    res.status(404).send({ code: 404, message: "No se ha encontrado ningun curso." })
                } else {
                    res.status(200).send({ code: 200, products: productStored });
                }
            }
        })

}

function deleteProduct(req, res) {
    const { id } = req.params;

    Product.findByIdAndRemove(id, (err, productDeleted) => {
        if (err) {
            res.status(500).send({ code: 500, message: "Error del servidor." })
        } else {
            if (!productDeleted) {
                res.status(404).send({ code: 404, message: "Producto no encontrado." })
            } else {
                res.status(200).send({ code: 200, message: "Producto eliminado correctamente." })
            }
        }
    })

}

function updateProduct(req, res) {
    const productData = req.body;
    const id = req.params.id;

    Product.findByIdAndUpdate(id, productData, (err, productUpdate) => {
        if (err) {
            res.status(500).send({ code: 500, message: "Error del servidor." })
        }
        else {
            if (!productUpdate) {
                res.status(404).send({ code: 404, message: "No se ha encontrado ningun producto." })
            }
            else {
                res.status(200).send({ code: 200, message: "Curso actualizado correctamente." })
            }
        }
    })


}
module.exports = {
    addProduct
    , getProducts
    , deleteProduct
    , updateProduct
}

