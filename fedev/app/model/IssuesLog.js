module.exports = (app) => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('sentry')
    const PostSchema = new Schema({
        // time 记录时间，维度到 天 例：xx19-xx-xx
        time: {
            type: Date
        },
        logs:{
            type:Object
        }
    })
    return conn.model('issues_log', PostSchema)
}
