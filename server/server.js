require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Configuración global de rutas
app.use(require('./routes/index'));

// Carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// useFindAndModify: false
mongoose.connect(process.env.URLDB, { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false }, (err, res) => {
    if(err) throw err;
    console.log(`Conexión a la DB establecida.`);
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});