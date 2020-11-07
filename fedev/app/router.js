// app/router.js
module.exports = app => {
    const { router, controller } = app
    router.get('/', controller.view.index)
    // 错误聚合
    require('./router/api')(app)
    require('./router/sentry')(app)
    // 性能聚合
    require('./router/perf')(app)
    // 自动化测试
    require('./router/airtest')(app)
    // 其他
    require('./router/other')(app)
    // 交易节点监控
    require('./router/trade_monitor')(app)
}
