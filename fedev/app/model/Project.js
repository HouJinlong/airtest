

module.exports = (app) => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('sentry')
    const PostSchema = new Schema({
        // 项目名称  唯一
        sentryName: {
            type: String
        },
        name: {
            type: String
        },
        // 更新时间
        updateTime: {
            type: String
        },
        // 项目错误修复文档地址
        docUrl: {
            type: String
        },
        // 负责人
        people: {
            type: String
        },
        // 接受错误通知邮箱
        email: {
            type: String
        }
    })
    return conn.model('project', PostSchema)
}
