const express = require('express');
const router = express.Router();
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

// Update artigo
router.post("/articles/updateArticle", adminAuth, (req, res) => {
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.update(
        {title: title, slug: slugify(title), body: body, categoryId: category}, {
        where:{
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(err => {
        res.redirect("/")
    })
})

// Página edição artigo
router.get("/admin/articles/editArticle/:id", adminAuth, (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.redirect("/admin/articles")
    }
    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories =>{
                res.render("admin/articles/editArticle", {article: article, categories: categories});
            })
            
        }else{
            res.redirect("/admin/articles")
        }
    }).catch(erro => {
        res.redirect("/admin/articles")
    })
})


router.get("/admin/articles", adminAuth, (req, res) => {
    Article.findAll({        
        order: [
        ['id', 'DESC' ]
    ],
        include: [{model: Category}]
    }).then(articles => {
        // res.json({ articles: articles });
        res.render("admin/articles/indexArticle", {articles: articles})
    })
})

router.get("/admin/articles/newArticle", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/newArticle", {categories: categories})
    })
})


// create a new article
router.post("/articles/saveArticle", adminAuth, (req, res) => {
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

router.post('/articles/delete', adminAuth, (req, res) => {
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

// paginacao de artigos
router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;
    limit = 6

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) - 1) * limit;
    }

    Article.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'DESC' ]
        ]
    }).then(articles => {
        var next;
        if(offset + limit >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles : articles
        }
        
        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories});
        })
    })

})

module.exports = router;
