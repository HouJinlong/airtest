const Service = require('egg').Service
class ExportService extends Service {
    async get ({ query = {}, query_key = {} } = {}) {
        const { Devices } = this.ctx.model.Airtest
        return (await Devices.find(query, query_key).sort({ _id: -1 }))
    }
    async add (params) {
        const { Devices } = this.ctx.model.Airtest
        return (await Devices.insertMany(params))
    }
    async update (query, params) {
        const { Devices } = this.ctx.model.Airtest
        return (await Devices.updateOne(query, { $set: params }))
    }
}

module.exports = ExportService
