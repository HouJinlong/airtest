module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('airtest')
    const PostSchema = new Schema({
        id: {
            type: String
        },
        // git地址
        url: {
            type: String
        },
        title: {
            type: String
        },
        version: {
            type: String
        }
    })
    return conn.model('git', PostSchema)
}
