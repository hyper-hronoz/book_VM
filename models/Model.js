const calculate = require('../build/Release/calculate')

class Model {
    constructor(fuilds, schema) {
        this.schema = schema
        this.fuilds = fuilds
        console.log("Model", fuilds, this.schema)

        class ModelValidator {
            constructor(schema, fuilds) {
                this.schema = schema;
                this.fuilds =fuilds;
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
                    this.isRequired(key, errors)
                    this.isRightType(key, errors)
                }
                if (errors.length) {
                    throw new Error(...errors)
                }
            }
        }

        this.ModelValidator = new ModelValidator(schema, fuilds);
        this.ModelValidator.checkData();
    }

    async save() {
        console.log("Saving user")
        console.log(calculate.calc())

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
