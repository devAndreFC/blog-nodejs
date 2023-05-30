const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database")
const CategoriesController = require("./categories/CategoriesController")
const ArticlesController = require("./articles/ArticlesController")

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

app.get("/", (req, res) => {
    res.render("index")
    })

app.listen(8080, () => {
    console.log("Server running");
})

