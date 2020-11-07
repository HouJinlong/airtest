module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('airtest')
    // 脚本配置表
    const PostSchema = new Schema({
        // android 手机的唯一标识 deviceName（相当于ios的udid）
        id: {
            type: String
        },
        // 设备 ip
        ip: {
            type: String
        },
        // 正在运行的任务id
        task_id: {
            type: String
        },
        model: {
            type: String
        },
        manufacturer: {
            type: String
        },
        platform: {
            type: String
        }
    })
    return conn.model('device', PostSchema)
}
