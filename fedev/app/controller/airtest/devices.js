const Controller = require('egg').Controller
class ExportController extends Controller {
    async get () {
        const { devices } = this.ctx.service.airtest
        const { has_ip, ...query } = this.ctx.query
        const data = await devices.get({
            query
        })
        this.ctx.body = {
            code: 0,
            message: '成功',
            data: data.filter(item => {
                if (has_ip === 'true') {
                    return item.ip !== ''
                }
                return true
            })
        }
    }

    async update () {
        const { devices } = this.ctx.service.airtest
        try {
            console.log(JSON.parse(this.ctx.request.body.data))
            const { id, ...params } = JSON.parse(this.ctx.request.body.data)
            const ret = await devices.get({
                query: {
                    id
                }
            })
            if (ret[0]) {
                await devices.update({ id }, params)
            } else {
                await devices.add({ ...params, id })
            }
            this.ctx.body = {
                code: 0,
                message: '成功'
            }
        } catch (error) {
            this.ctx.logger.error(error)
            this.ctx.body = {
                code: 2,
                message: error.toString()
            }
        }
    }
}

module.exports = ExportController
