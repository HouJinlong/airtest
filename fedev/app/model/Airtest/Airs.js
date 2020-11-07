module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('airtest')
    const PostSchema = new Schema({
        path: {
            type: String
        },
        title: {
            type: String
        },
        git_id: {
            type: String
        },
        email: {
            type: String
        },
        type: {
            type: String
        },
        base: {
            type: String
        }
    })
    return conn.model('air', PostSchema)
}
