module.exports = app => {
    const { router, controller } = app
    router.get('/api/addProject', controller.project.add)
    router.get('/api/removeProject', controller.project.remove)

    router.get('/api/pullIssues', controller.issues.pull)
    router.get('/api/removeIssues', controller.issues.remove)
    router.get('/api/updateIssues', controller.issues.update)

    router.get('/api/addConfig', controller.configuration.add)
    router.get('/api/removeConfig', controller.configuration.remove)


}
