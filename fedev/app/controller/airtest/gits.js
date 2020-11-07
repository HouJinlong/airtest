const Controller = require('egg').Controller
const { throw_err } = require('../../utils/tools')

class ExportController extends Controller {
    async get () {
        const { gits } = this.ctx.service.airtest
        const data = await gits.get(this.ctx.query)
        this.ctx.body = {
            code: 0,
            message: '成功',
            data
        }
    }

    async add () {
        const { gits } = this.ctx.service.airtest
        try {
            console.log(this.ctx.request.body)
            const { id = throw_err('缺少参数id'),
                url = throw_err('缺少参数url'),
                title = throw_err('缺少参数title')
            } = this.ctx.request.body
            const data = await gits.get({ id })
            if (data.length > 0) {
                throw_err(id + '已存在')
            } else {
                this.ctx.body = {
                    code: 0,
                    message: '成功',
                    data: ((await gits.add({ id, url, title }))[0])
                }
            }
        } catch (error) {
            this.ctx.logger.error(error)
            this.ctx.body = {
                code: 2,
                message: error.toString()
            }
        }
    }

    async update () {
        const { gits } = this.ctx.service.airtest
        try {
            const { id = throw_err('缺少参数 id'), update,...params } = this.ctx.request.body
            const data = ((await gits.get({ id }))[0])
            if (data) {
                if(update){
                    params.version = ''
                }
                await gits.update({ id }, params)
                this.ctx.body = {
                    code: 0,
                    message: '成功',
                    data: ((await gits.get({ id }))[0])
                }
            } else {
                throw_err('未找到id:' + id)
            }
        } catch (error) {
            this.ctx.logger.error(error)
            this.ctx.body = {
                code: 2,
                message: error.toString()
            }
        }
    }

    async del () {
        const { gits,airs } = this.ctx.service.airtest
        try {
            console.log(this.ctx.request.body)
            const { id = throw_err('缺少参数 id') } = this.ctx.request.body
            const data = await gits.get({ id })
            if (data[0]) {
                await airs.del({git_id:id})
                this.ctx.body = {
                    code: 0,
                    message: '成功',
                    data: (await gits.del({ id }))
                }
            } else {
                throw_err('未找到id:' + id)
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
