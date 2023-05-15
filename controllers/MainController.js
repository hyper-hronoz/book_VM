class MainController {
    constructor() {
        if (MainController._instance) {
            return MainController._instance
        }
        MainController._instance = this
    }
    main(req, res) {
        res.send("That is restful api for book_VM web service")
    } 
}

module.exports = new MainController()
