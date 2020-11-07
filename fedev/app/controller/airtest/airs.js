const Controller = require('egg').Controller
const { throw_err } = require('../../utils/tools')
const sendEmail = require('../../utils/sendEmail')
class ExportController extends Controller {
    async get () {
        const { airs } = this.ctx.service.airtest
        const data = await airs.get(this.ctx.query)
        this.ctx.body = {
            code: 0,
            message: '成功',
            data
        }
    }

    async add () {
        const { airs } = this.ctx.service.airtest
        try {
            console.log(this.ctx.request.body)
            const { path = throw_err('缺少参数path'),
                title = throw_err('缺少参数title'),
                git_id = throw_err('缺少参数git_id'),
                type = 0,
                email = ''
            } = this.ctx.request.body
            // 发邮件
            const emailArr = email.split(',')
            if (emailArr.length > 0) {
                emailArr.forEach(v => {
                    sendEmail.sendtest(v, '【自动化测试通知】【关联测试脚本( ' + path + ' )】')
                })
            }
            this.ctx.body = {
                code: 0,
                message: '成功',
                data: (await airs.add({ path, git_id, title, email, type }))[0]
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
        const { airs } = this.ctx.service.airtest
        try {
            const {
                _id = throw_err('缺少参数 _id'),
                ...params
            } = this.ctx.request.body
            const ret = (await airs.get({ _id }))[0]
            if (ret) {
                if (params.email) {
                    const emailArr = params.email.split(',')
                    const oldemailArr = ret.email.split(',')
                    emailArr.forEach(v => {
                        if (!oldemailArr.includes(v)) {
                            sendEmail.sendtest(v, '【自动化测试通知】【关联测试脚本( ' + ret.title + ' )】')
                        }
                    })
                    oldemailArr.forEach(v => {
                        if (!emailArr.includes(v)) {
                            sendEmail.sendtest(v, '【自动化测试通知】【取消关联测试脚本( ' + ret.title + ' )】')
                        }
                    })
                }
                await airs.update({ _id }, params)
                this.ctx.body = {
                    code: 0,
                    message: '成功',
                    data: (await airs.get({ _id }))[0]
                }
            } else {
                throw_err('未找到id:' + _id)
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
        const { airs } = this.ctx.service.airtest
        try {
            console.log(this.ctx.request.body)
            const { _id = throw_err('缺少参数 _id') } = this.ctx.request.body
            const data = await airs.get({ _id })
            if (data[0]) {
                this.ctx.body = {
                    code: 0,
                    message: '成功',
                    data: (await airs.del({ _id }))
                }
            } else {
                throw_err('未找到id:' + _id)
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
