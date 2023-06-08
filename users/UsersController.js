const express = require('express');
const router = express.Router();
const User = require('./User')
const bcrypt = require('bcryptjs');


router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/indexUser", {users: users})
    })
})

router.get('/admin/users/newUser', (req, res) => {
    res.render('admin/users/newUser')
})

router.post('/users/save', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({where: {email: email}}).then(user => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)
        
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.render('admin/users/indexUser')
            }).catch(err => {
                res.send("erro na criacao do user")
            })
        }else{
            res.send("email existente")
        }
    })
})

// rota de login admin
router.get('/login', (req, res) => {
    res.render("admin/users/loginUser")
})

router.post('/authenticate', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({ email: email}).then(user => {
        if (user != undefined) {
            // validate password
            var correctPassword = bcrypt.compare(password, user.password)
            if (correctPassword){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.json(req.session.user) // para teste
            }else {
                res.send("senha incorreta")
            }
        }else {
            res.send("usuario não existe")
        }
    });
})



module.exports = router