const defaults = {
    notNull: true,
}

class Fuild {
    constructor(value, ...args) {
        this.value = value
        this.args = args
    }

    check() {
        console.log(value)
        console.log(args) 
    }  
}

module.exports = Fuild
