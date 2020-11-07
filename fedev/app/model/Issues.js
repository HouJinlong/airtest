module.exports = (app) => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('sentry')
    const PostSchema = new Schema({
        // sentry 错误id 唯一
        id: {
            type: String
        },
        // sentry 地址
        url: {
            type: String
        },
        // sentry 错误标题
        title: {
            type: String
        },
        // sentry 错误详情
        metadata: {
            type: Object
        },
        // sentry 首次出现时间
        firstSeen: {
            type: Date
        },
        // sentry 最后出现时间
        lastSeen: {
            type: Date
        },
        // sentry 出现次数
        count: {
            type: Number
        },
        // sentry 影响用户数
        userCount: {
            type: Number
        },
        // 错误属于哪个项目
        project: {
            type: String
        },
        // 负责人
        people: {
            type: String
        },
        // 问题状态  1'未开始'  2'解决中'  3'已解决' 4'删除'
        status: {
            type: Number
        },
        // 上报错误UA包含此内容的忽略格式：UA1|UA2|UA3
        ua:{
            type:String
        }
    })
    return conn.model('issues', PostSchema)
}
