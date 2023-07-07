const express = require("express");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const router = express.Router();
const {
    registrarUsuario,
    obtenerDatosDeUsuario,
    verificarCredenciales,
} = require("../consultas/consultas");

const {
    checkCredentialsExists,
    tokenVerification,
} = require("../middleware/middleware");

router.get("/", (req, res) => {
    res.send("Hello World");
});

router.post("/usuarios", checkCredentialsExists, async (req, res) => {
    try {
        const usuario = req.body;
        await registrarUsuario(usuario);
        res.send("Usuario registrado con éxito");
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/usuarios", tokenVerification, async (req, res) => {
    try {
        const token = req.header("Authorization").split("Bearer ")[1];
        const { email } = jwt.decode(token);
        const usuario = await obtenerDatosDeUsuario(email);
        res.json(usuario);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, process.env.SECRET);
        res.send(token);
    } catch (err) {
        res.status(500).send('Email o contraseña incorrecta');
    }
});

module.exports = router;
