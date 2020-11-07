const Service = require('egg').Service
class ExportService extends Service {
    async add (data) {
        const { Tasks } = this.ctx.model.Airtest
        const { counter } = this.ctx.service
        for (let i = 0; i < data.length; i++) {
            data[i].id = (await counter.getNextSequenceValue('task'))
        }
        await Tasks.insertMany(data)
    }
    // 获取指定条件的任务列表+分页
    async get_list (query, { page_number = 1, page_size = 10 }) {
        const { Tasks } = this.ctx.model.Airtest
        return {
            count: (await Tasks.count(query)),
            list: (await Tasks.find(query).skip((page_number * 1 - 1) * page_size).limit(page_size * 1)
                .sort({ _id: -1 }))
        }
    }
    async get ($match) {
        const { Tasks } = this.ctx.model.Airtest
        return await Tasks.aggregate([
            { $match },
            { $sort: { id: 1 } },
            { $limit: 1 }]
        )
    }

    async update (query, params) {
        const { Tasks } = this.ctx.model.Airtest
        await Tasks.updateOne(query, { $set: params })
    }

    async del (query) {
        const { Tasks } = this.ctx.model.Airtest
        await Tasks.remove(query)
    }
}

module.exports = ExportService
