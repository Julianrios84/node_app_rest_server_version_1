const express = require('express');
let { verificaToken, verificaRole } = require('../middlewares/autentificacion');
let app = express();
let Producto = require('../models/producto');



// Obtener todos los productos | populate: usuario, categoria | paginación
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible: true})
        .skip(desde).limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({disponible: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    registros: conteo,
                    productos,
                });
            });
        });

});

// Obtener un producto | populate: usuario, categoria | paginación
app.get('/producto/:id', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let id = req.params.id;

    Producto.findById(id)
        .skip(desde).limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productodb) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if(!productodb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }
           
            res.json({
                ok: true,
                producto: productodb
            });

        });
});

// Crear un producto | con ID: usuario, categoria
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        desponible: body.disponible,
        categoria: body.categoria,
    });

    producto.save((err, productodb) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productodb
        });

    })

});

//  Actualizar un producto
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, (err, productodb) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productodb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productodb.nombre = body.nombre;
        productodb.precioUni = body.precioUni;
        productodb.categoria = body.categoria;
        productodb.disponible = body.disponible;
        productodb.descripcion = body.descripcion;

        productodb.save((err, productosave) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productosave
            });

        });

    });

});

// Remover un producto | Cambiar estado del producto 
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productodb) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productodb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productodb.disponible = false;

        productodb.save((err, productoRemove) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoRemove,
                message: 'Producto eliminado'
            });

        });


    });
});

// Buscar productos
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regexp = new RegExp(termino, 'i');

    Producto.find({nombre: regexp})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
           
            Producto.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    registros: conteo,
                    productos
                });
            });

        });
});


module.exports = app;