class ProfileController {
    constructor() {
        if (ProfileController._instance) {
            return ProfileController._instance
        }
        ProfileController._instance = this
    }

    stumb(req, res) {
        res.send("That is main page!")
    }     
}

module.exports = new ProfileController();
