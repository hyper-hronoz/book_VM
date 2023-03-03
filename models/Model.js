

class Model {
    constructor(fuilds, schema) {
        this.schema = schema
        console.log("Model", fuilds, this.schema)
        this.checkData()
    }

    isRequired(key) {
        console.log(this.schema[key])
        if (this.schema[key].required && this.fuilds[key]) {
            
        }
    }

    checkData() {
        for (const key of Object.keys(this.schema)) {
            console.log(key)
            this.isRequired(key)
        }
    }

    async save() {
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
