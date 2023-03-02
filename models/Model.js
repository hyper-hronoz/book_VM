class Model {
    constructor(fuilds) {
        if (fuilds) {
            this.fuilds = fuilds
        }
        console.log("This is this: ", this)
    }

    checkData() {
    }

    save() {
        this._notifyChanges()
    }

    static async findOne(...args) {
        console.log("Looking for one user")
    }

    static async deleteOne(...args) {

    }

    // there will be observer pattern
    _notifyChanges() {
       
    }
}

module.exports = Model;
