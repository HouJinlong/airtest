const Service = require('egg').Service
class ExportService extends Service {
    async get (query) {
        const { Airs } = this.ctx.model.Airtest
        return (await Airs.find(query).sort({ _id: -1 }))
    }

    async update (query, params) {
        const { Airs } = this.ctx.model.Airtest
        await Airs.updateOne(query, { $set: params })
    }

    async del (query) {
        const { Airs } = this.ctx.model.Airtest
        await Airs.remove(query)
    }

    async add (params) {
        const { Airs } = this.ctx.model.Airtest
        return (await Airs.insertMany(params))
    }
}

module.exports = ExportService
