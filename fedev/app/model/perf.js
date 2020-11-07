module.exports = (app) => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const conn = app.mongooseDB.get('perform')
    const PerfSchema = new Schema({
        // 日期
        _date: {
            type: String
        },
        // page key=[${pageId}_${channel}_${os}]
        pName: {
            type: String
        },
        // 性能数据总条数
        cnt: {
            type: Number
        },
        // 到家App，webview初始化时间的中位数
        pageWebkitPrepareTime_p50: {
            type: Number
        },
        // 到家App，webview初始化时间的平均数
        pageWebkitPrepareTime_avg: {
            type: Number
        },
        // 到家App，webview初始化时间的百分比数据
        pageWebkitPrepareTime_col: {
            type: Array
        },
        // 页面HTML返回的时间中位数
        pageRequestHtmlTime_p50: {
            type: Number
        },
        // 页面HTML返回的时间平均数
        pageRequestHtmlTime_avg: {
            type: Number
        },
        // 页面HTML返回的时间的百分比数据
        pageRequestHtmlTime_col: {
            type: Array
        },
        // 页面静态资源返回的时间中位数
        pageRequestResourceTime_p50: {
            type: Number
        },
        // 页面静态资源返回的时间平均数
        pageRequestResourceTime_avg: {
            type: Number
        },
        // 页面静态资源返回的时间的百分比数据
        pageRequestResourceTime_col: {
            type: Array
        },
        // 页面API返回的时间中位数
        pageApiTime_p50: {
            type: Number
        },
        // 页面API返回的时间平均数
        pageApiTime_avg: {
            type: Number
        },
        // 页面API返回的时间的百分比数据
        pageApiTime_col: {
            type: Array
        },
        // 页面渲染时间中位数
        pageRenderTime_p50: {
            type: Number
        },
        // 页面渲染时间平均数
        pageRenderTime_avg: {
            type: Number
        },
        // 页面渲染时间的百分比数据
        pageRenderTime_col: {
            type: Array
        },
        // 页面加载全部时间中位数
        pageWholeTime_p50: {
            type: Number
        },
        // 页面加载全部时间平均数
        pageWholeTime_avg: {
            type: Number
        },
        // 页面加载全部时间的百分比数据
        pageWholeTime_col: {
            type: Array
        }
    })

    return conn.model('perform', PerfSchema, 'perform')
}
