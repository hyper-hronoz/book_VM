

class Model {
    constructor(...args) {

    }

    save() {

        this._notifyChanges()
    }

    static findOne(...args) {
        console.log("Looking for one user")
    }

    static deleteOne(...args) {

    }

    // there will be observer pattern
    _notifyChanges() {
       
    }
}

module.exports = Model;
