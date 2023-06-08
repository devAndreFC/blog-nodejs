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
    secret: "secret", cookie: {maxAge: 30000}
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

//rota de session para teste. será apagada
// app.get("/session", (req, res) => {
//     req.session.treinamento = "formação node.js"
//     req.session.ano = 2023
//     req.session.email = "email@teste.com"
//     req.session.user = {
//         username: "andre",
//         email: "andre@email.com",
//         id: 10
//     }
//     res.send("sessao gerada")
// })

// app.get("/leitura", (req, res) => {
//     res.json({
//         treinamento: req.session.treinamento,
//         ano: req.session.ano,
//         email: req.session.email,
//         user: req.session.user
//     })
// })

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC' ]
        ], limit: 3
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

