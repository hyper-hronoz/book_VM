const defaults = {
    notNull: true,
}

class Fuild {
    constructor(value) {
        this.value = value
        this.errors = []
    }
    
    empty(args) {
        try {
            if (!this.value) {
                if (args.message) {
                    this.errors.push(this.message ? this.message : `Fuild is empty`)
                }
            }
            return this;
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = Fuild
