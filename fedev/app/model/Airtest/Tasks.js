module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('airtest')
    const PostSchema = new Schema({
        id: { // task+自增数字
            type: String
        },
        // 任务时间
        time: {
            type: String
        },
        air_id: {
            type: String
        },
        git_id: {
            type: String
        },
        device_id: {
            type: String
        },
        path: {
            type: String
        },
        title: {
            type: String
        },
        email: {
            type: String
        },
        base: {
            type: String
        },
        // 版本号
        version: {
            type: String
        },
        // 状态 0 等待中 1进行中 2成功 3失败
        status: {
            type: Number
        },
        // status 为3 时 失败描述
        msg: {
            type: String
        },
        // 日志报告
        log_url: {
            type: String
        },
        // 结果分析
        diff_imgs: {
            type: Object
        },
        // 是否基准  基准任务无法删除
        is_base: {
            type: Boolean
        }
    })
    return conn.model('task', PostSchema)
}
