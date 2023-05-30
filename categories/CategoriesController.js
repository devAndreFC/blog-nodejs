const express = require('express');
const router = express.Router();

router.get("/categories", (req, res) => {
    res.send('Rota de categorias')
})

router.get("/admin/categories/new", (req, res) => {
    res.send('Rota de criação de categorias')
})


module.exports = router;
