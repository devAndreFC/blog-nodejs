const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database")
const session = require("express-session");

const CategoriesController = require("./categories/CategoriesController")
const ArticlesController = require("./articles/ArticlesController")
const UserController = require("./users/UsersController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

// sessions
app.use(session({
    secret: "secret", cookie: {maxAge: 3000000}
}))

// View Engine configuration
app.set('view engine', 'ejs')

// Static
app.use(express.static('public'))

// body parsing configuration
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// database
connection
    .authenticate()
    .then(() => {
        console.log("conectado ao bd")
    }).catch((error) => {
        console.log("error: " + error);
    })    

app.use("/", CategoriesController);
app.use("/", ArticlesController);
app.use("/", UserController);

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC' ]
        ], limit: 6
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories });  
        })
    })
})

// menu navbar das categorias
app.get("/:slug",(req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
})

// rota das categorias, clicando no link da navbar
app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where:{
            slug: slug
        },
        include:[{model: Article}]
    }).then(category => {
        if (category !== undefined) {
            Category.findAll().then(categories => {
            res.render("index", {articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

app.listen(8080, () => {
    console.log("Server running");
})

