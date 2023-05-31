const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
// const flash = require('connect-flash');

// Ver categories
router.get("/admin/categories/newCategory", (req, res) => {
    res.render("admin/categories/newCategory")
})

// Update categoria
router.post("/categories/updateCategory", (req, res) => {
    var id = req.body.id
    var title = req.body.title

    Category.update(
        {title: title, slug: slugify(title)}, {
        where:{
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})

// Página edição Category
router.get("/admin/categories/editCategory/:id", (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.redirect("/admin/categories")
    }
    
    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render("admin/categories/editCategory", {category: category});
        }else{
            res.redirect("/admin/categories")
        }
    }).catch(erro => {
        res.redirect("/admin/categories")
    })
})

// Deletar category
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

// Criar category
router.post("/categories/save", (req, res) => {
    var title = req.body.title // atributo 'name' do campo que desejo pegar
    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            // req.flash('success', 'Categoria cadastrada com sucesso!');
            res.redirect("/admin/categories");
        })
    }else{
        res.redirect("/admin/categories/newCategory")
    }
})

router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/indexCategory", {categories: categories})
    })
    
})

module.exports = router;
