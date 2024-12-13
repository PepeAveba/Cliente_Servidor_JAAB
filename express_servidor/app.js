const express = require('express');

const app = express();

app.get('/', (req, res) =>{
    res.status(404).send('Hola mundo!');
})

app.listen(3000,() => {
    console.log("Servidor corriendo en puerto 3000");
});
