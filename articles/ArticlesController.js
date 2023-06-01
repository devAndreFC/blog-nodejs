const express = require('express');
const router = express.Router();
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/indexArticle", {articles: articles})
    })
})

router.get("/admin/articles/newArticle", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/newArticle", {categories: categories})
    })
})


// create a new article
router.post("/articles/saveArticle", (req, res) => {
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title), 
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

router.post('/articles/delete', (req, res) => {
    var id = req.body.id
    if (id != undefined) {
        if(!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        }else{
            res.redirect("/admin/articles")
        }
    }else{
        res.redirect("/admin/articles")
    }
})

module.exports = router;
