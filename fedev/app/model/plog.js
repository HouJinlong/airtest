module.exports = (app) => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('perform')
    const PlogSchema = new Schema({
        channel: {
            type: String
        },
        id: {
            type: Number
        },
        lat: {
            type: String
        },
        lng: {
            type: String
        },
        os: {
            type: String
        },
        pageApiTime: {
            type: Number
        },
        pageId: {
            type: String
        },
        pageRenderTime: {
            type: Number
        },
        pageRequestHtmlTime: {
            type: Number
        },
        pageRequestResourceTime: {
            type: Number
        },
        pageWebkitPrepareTime: {
            type: Number
        },
        pageWholeTime: {
            type: Number
        },
        url: {
            type: String
        },
        zip: {
            type: String
        },
        // 日期
        _date: {
            type: String
        },
        deviceId: {
            type: String
        },
        userId: {
            type: String
        },
        version: {
            type: String
        },
        network: {
            type: String
        }
    })

    return conn.model('plog', PlogSchema, 'log')
}
