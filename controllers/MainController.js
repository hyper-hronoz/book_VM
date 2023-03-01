

class MainController {
    main(req, res) {
        res.send("Hello there this is main page!")
    } 
}

module.exports = new MainController()
