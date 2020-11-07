module.exports = app => {
    const { router, controller } = app
    // 短链生成工具
    router.get('/other/getTinyUrl', controller.other.pageTinyUrl)
    router.post('/other/api/getTinyUrl', controller.other.getTinyUrl)
    // FE项目master更新 测试环境代码更新
    router.post('/other/api/update_test_code', controller.other.update_test_code)
    // 直接触发 代码同步
    router.get('/other/api/trigger_update_test_code', controller.other.trigger_update_test_code)
}
