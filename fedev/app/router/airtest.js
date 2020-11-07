module.exports = app => {
    const { router, controller } = app

    router.get('/airtest/gits/get', controller.airtest.gits.get)
    router.post('/airtest/gits/add', controller.airtest.gits.add)
    router.post('/airtest/gits/update', controller.airtest.gits.update)
    router.post('/airtest/gits/del', controller.airtest.gits.del)

    router.get('/airtest/airs/get', controller.airtest.airs.get)
    router.post('/airtest/airs/add', controller.airtest.airs.add)
    router.post('/airtest/airs/update', controller.airtest.airs.update)
    router.post('/airtest/airs/del', controller.airtest.airs.del)

    router.post('/airtest/tasks/add', controller.airtest.tasks.add)
    router.post('/airtest/tasks/update', controller.airtest.tasks.update)
    router.get('/airtest/tasks/get', controller.airtest.tasks.get)
    router.get('/airtest/tasks/get_list', controller.airtest.tasks.get_list)
    router.post('/airtest/tasks/del', controller.airtest.tasks.del)

    router.get('/airtest/devices/get', controller.airtest.devices.get)
    router.post('/airtest/devices/update', controller.airtest.devices.update)

    router.get('/airtest/other/analysis', controller.airtest.other.analysis)
}
