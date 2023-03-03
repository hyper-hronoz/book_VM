const Fuild = require("../fuilds/Fuild")

class StringFuild extends Fuild {
    constructor(name) {
        super(name)
        return this
    }

    isLength(args) {
        try {
            if (!args.min || args.min < 0) {
                args.min = 0
            }
            if (!args.max || args.max < 1) {
                args.max = 99999999999
            }

            if (args.min <= this.name.length <= args.max) {
                return this
            }
            this.errors.push(args.message ? args.message  : `Invalid length min: ${args.min} max: ${args.max}`)
        } catch(e) {
            console.error(e)
        }
        return this
    }
}

module.exports = StringFuild
