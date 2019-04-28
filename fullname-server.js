var express = require('express');
var app = express();

var rest = require('request');
app.set('rest',rest);

var fs = require('fs');
var https = require('https');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

var fileUpload = require('express-fileupload');
app.use(fileUpload());

app.set('port', 3000);

app.use(express.static('public'));


app.get("/api/fullname", function(req, res) {
    var nombre = req.query.nombre;
    var apellidos = req.query.apellidos;
    res.status(200);
    res.send( JSON.stringify(nombre + apellidos) );
});

app.post("/api/fullname", function(req, res) {
    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    res.status(201);
    res.send( JSON.stringify(nombre + apellidos) );
});


app.use( function (err, req, res, next ) {
    console.log("Error producido: " + err); //we log the error in our db
    if (! res.headersSent) {
        res.status(400);
        res.send("Recurso no disponible");
    }
});

// lanzar el servidor
https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function() {
    console.log("Servidor activo");
});