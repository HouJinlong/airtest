module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('trade_monitor')
    const GioSchema = new Schema({
        time: {
            type: Number
        },
        type: {
            type: String
        },
        data: {
            type: Number
        }
    })

    return conn.model('gio', GioSchema, 'gio')
}
