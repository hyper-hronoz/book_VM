class ProfileController {
    constructor() {
        if (ProfileController._instance) {
            return ProfileController._instance
        }
        ProfileController._instance = this
    }

    stumb(req, res) {

    }     
}


module.exports = new ProfileController();
