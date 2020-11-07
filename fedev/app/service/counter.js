

const Service = require('egg').Service
class ExportService extends Service {
    // 实现自增id
    async getNextSequenceValue (key) {
        const { Counter } = this.ctx.model.Airtest
        const ret = await Counter.findByIdAndUpdate({ _id: key }, { $inc: { seq: 1 } }, { new: true, upsert: true })
        return ret.seq
    }
}

module.exports = ExportService
