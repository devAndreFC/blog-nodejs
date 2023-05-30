const express = require('express');
const router = express.Router();

router.get("/articles", (req, res) => {
    res.send('Rota de artigos')
})

router.get("/admin/articles/new", (req, res) => {
    res.send('Rota de criação de artigos')
})


module.exports = router;
