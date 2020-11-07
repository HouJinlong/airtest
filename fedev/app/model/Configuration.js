module.exports = (app) => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('sentry')
    const PostSchema = new Schema({
        // 该配置用来做什么 目前只有一条 Configuration：项目的人员和过滤规则的配置
        type: {
            type: String
        },
        // 人员
        people: {
            type: Array
        },
        // 过滤规则
        filter: {
            type: Array
        }
    })
    return conn.model('config', PostSchema)
}
