const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({useTempFiles: true}));


app.put('/upload/:type/:id', (req, res) => {

    let id = req.params.id;
    let type = req.params.type;

    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son '+ tiposValidos.join(', '),
            }
        });
    }

    let archivo  = req.files.archivo;
    // Obtener el nombre del archivo
    let splitArchivo = archivo.name.split('.');
    // Extencion del archivo
    let extArchivo = splitArchivo[splitArchivo.length - 1];
    // Extenciones permitidas
    let extValidate = ['png', 'jpg', 'gif', 'jpeg'];

    if(extValidate.indexOf(extArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las estenciones permitidas son '+ extValidate.join(', '),
                ext: extArchivo
            }
        })
    }


    // Cambiar nombre del archivo
    let nameArchivo = `${id}-${new Date().getTime()}.${extArchivo}`; 

    archivo.mv(`uploads/${type}/${nameArchivo}`, (err) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Cargamos la imagen

        if(type === 'usuarios'){
            imageUser(id, res, nameArchivo, type);
        }else if(type === 'productos'){
            imageProduct(id, res, nameArchivo, type)
        }


    })

});

function imageUser(id, res, nameArchivo, type) {

    Usuario.findById(id , (err, usuariodb) => {
        if(err) {
            deleteFile(nameArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuariodb) {
            deleteFile(nameArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        deleteFile(usuariodb.img, type);

        usuariodb.img = nameArchivo;

        usuariodb.save((err, usuariosave) => {
            res.json({
                ok: true,
                usuario: usuariosave,
                img: nameArchivo,
                message: 'Imagen subida correctamente'
            });
        });

    });
}

function imageProduct(id, res, nameArchivo, type){
    Producto.findById(id , (err, productodb) => {
        if(err) {
            deleteFile(nameArchivo, type);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productodb) {
            deleteFile(nameArchivo, type);
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        deleteFile(productodb.img, type);

        productodb.img = nameArchivo;

        productodb.save((err, productosave) => {
            res.json({
                ok: true,
                producto: productosave,
                img: nameArchivo,
                message: 'Imagen subida correctamente'
            });
        });

    });
}

function deleteFile(nameImage, type){
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${nameImage}`);

        if(fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage)
        }
}

module.exports = app;