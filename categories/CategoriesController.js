const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
// const flash = require('connect-flash');

router.get("/admin/categories/newCategory", (req, res) => {
    res.render("admin/categories/newCategory")
})

router.post("/categories/delete", (req, res) => {
    var id = req.body.id
    if (id !== undefined) {
        if (!isNaN(id)) {
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            });
        }else{
            res.redirect("/admin/categories")
        }
    }else{
        res.redirect("/admin/categories")
    }
})
router.post("/categories/save", (req, res) => {
    var title = req.body.title // atributo 'name' do campo que desejo pegar
    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            // req.flash('success', 'Categoria cadastrada com sucesso!');
            res.redirect("/");
        })
    }else{
        res.redirect("/admin/categories/newCategory")
    }
})

router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/indexCategories", {categories: categories})
    })
    
})

module.exports = router;
