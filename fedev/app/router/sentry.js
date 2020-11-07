module.exports = app => {
    const { router, controller } = app
    // 首页全部项目
    router.get('/sentry', controller.sentry.index)
    // 报告页
    router.get('/sentry/report', controller.sentry.report)
    // 配置页
    router.get('/sentry/configuration', controller.sentry.configuration)
    // 项目列表页
    router.get('/sentry/projects', controller.sentry.projects)

}
