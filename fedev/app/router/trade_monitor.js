module.exports = app => {
    const { router, controller } = app
    // 首页
    router.get('/trade_monitor', controller.tradeMonitor.index)
    // 获取数据接口
    router.get('/trade_monitor/api/getChartData', controller.tradeMonitor.getChartData)
}
