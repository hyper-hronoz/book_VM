class MainController {
    constructor() {
        if (MainController._instance) {
            return MainController._instance
        }
        MainController._instance = this
    }
    main(req, res) {
        res.send("Hello there this is main page!")
    } 
}

module.exports = new MainController()
