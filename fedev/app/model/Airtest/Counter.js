// 实现自增id
module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('airtest')
    const PostSchema = new Schema({
        _id: {
            type: String,
            required: true
        },
        seq: {
            type: Number
        }
    })
    return conn.model('counter', PostSchema)
}
