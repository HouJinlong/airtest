const Service = require('egg').Service
class ProjectService extends Service {
    async add (params) {
        const {Project} = this.ctx.model
        let result = await Project.create(params)
        return result
    }

    async get (params) {
        const {Project} = this.ctx.model
        const result = await Project.find(params)
        return result
    }

    async update (sentryName, params) {
        const obj = {sentryName}
        const {Project} = this.ctx.model
        const result = await Project.update(obj, { $set: params})
        return result
    }

    async remove (params) {
        const {Project} = this.ctx.model
        let result = await Project.remove(params)
        return result
    }
}

module.exports = ProjectService
