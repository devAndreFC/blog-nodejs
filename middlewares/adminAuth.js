function adminAuth(req, res, next) {
    if (req.session.user != undefined) {
        next()
    }else{
        // res.send('You are not logged in')
        res.redirect('/login')
    }
}

module.exports = adminAuth