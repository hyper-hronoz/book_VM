

class Model {
    constructor(fuilds, schema) {
        this.schema = schema
        this.fuilds = fuilds
        console.log("Model", fuilds, this.schema)
        this.checkData()
    }

    isRequired(key, errors) {
        console.log(this.schema[key])
        if (this.schema[key].required && !(key in this.fuilds)) {
            errors.push(`Fuild ${key} is absent in model`)
        }
    }

    isRightType(key, errors) {
        if (this.schema[key].type(this.fuilds[key]) !== this.fuilds[key] ) {
           errors.push(`Fuild ${key} is wrong type. Type ${this.schema[key].type} needed`) 
        }
    }

    checkData() {
        const errors = []
        for (const key of Object.keys(this.schema)) {
            console.log(key)
            this.isRequired(key, errors)
            this.isRightType(key, errors)
        }
        if (errors.length) {
            throw new Error(...errors)
        }
    }

    async save() {
        console.log("Saving user")

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
