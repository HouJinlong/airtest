module.exports = app => {
    const { router, controller } = app
    // 首页
    router.get('/perf', controller.perf.index)

    // 查询某个页面一段时间的性能数据
    router.get('/perf/page_by_date', controller.perf.pagePerf)

    // 性能报告数据
    router.get('/perf/report', controller.perf.getReport)

    // 查询某个页面某一天某个性能指标的柱状图数据
    router.get('/perf/get_attr_col', controller.perf.getAttrCol)

    // api, 获取某个页面某个性能指标满足条件的日志列表
    router.get('/perf/getLogList', controller.perf.getLogList)

    // 查询页面性能指标配置
    router.get('/perf/get_attr_conf', controller.perf.getPageAttrConf)

    // 获取昨天跟之前一周均值性能数据对比
    router.get('/perf/get_comp_data', controller.perf.getCompData)
}
