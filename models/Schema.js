class Schema {
    constructor(value) {
        try {
            Object.assign(this, value)
        } catch(e) {
            console.log(e)
        }
    }
}

module.exports = Schema

