const Service = require('egg').Service
class ExportService extends Service {
    async get (query) {
        const { Gits } = this.ctx.model.Airtest
        return (await Gits.find(query).sort({ _id: -1 }))
    }

    async update (query, params) {
        const { Gits } = this.ctx.model.Airtest
        await Gits.updateOne(query, { $set: params })
    }

    async del (query) {
        const { Gits } = this.ctx.model.Airtest
        await Gits.remove(query)
    }

    async add (params) {
        const { Gits } = this.ctx.model.Airtest
        return (await Gits.insertMany(params))
    }
}

module.exports = ExportService
