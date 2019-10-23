const express = require('express');
let { verificaToken, verificaRole } = require('../middlewares/autentificacion');
let app = express();
let Categoria = require('../models/categoria');

// Consultar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if(err) {
                return  res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });
});

// Consultar una categoria
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriadb) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriadb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriadb
        });

    });
});

// Crear nueva categoria
app.post('/categoria', [verificaToken, verificaRole], (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriadb) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriadb) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriadb,
        });

    });

});

// Actualizar categoria
app.put('/categoria/:id', [verificaToken, verificaRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let updateData = {
        descripcion: body.descripcion,
    };

    Categoria.findByIdAndUpdate(id, updateData, {new: true, runValidators: true}, (err, categoriadb) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriadb) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriadb
        });

    });

});

// Eliminar categria
app.delete('/categoria/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriadb) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriadb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriadb,
            nessage: 'Categoria eliminada'
        });
    });

});

module.exports = app;