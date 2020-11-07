const Controller = require('egg').Controller
const request = require('request-promise')
class ExportController extends Controller {
    async pageTinyUrl () {
        await this.ctx.render('other/getTinyUrl.html')
    }
    async getTinyUrl () {
        try {
            const { longUrl, bussinessId } = this.ctx.request.body
            const data = JSON.parse((await request.post({
                url: 'http://tools.daojia-inc.com/tinyUrl',
                formData: {
                    longUrl,
                    bussinessId
                }
            })))
            if (data.code === 0) {
                this.ctx.body = {
                    code: 0,
                    message: '成功',
                    data: 'https://s.dj.tc/o?' + data.tinyUrl.split('/').pop()
                }
            } else {
                this.ctx.body = data
            }
        } catch (error) {
            this.ctx.logger.error(error)
            this.ctx.body = {
                code: 2,
                message: error.toString()
            }
        }
    }

    // FE项目master更新 测试环境代码更新
    async update_test_code () {
        const { ref } = this.ctx.request.body
        console.log(this.ctx.request.body)
        if (ref === 'refs/heads/master') {
            const { other } = this.ctx.service
            await other.fe_project_save(this.ctx.request.body)
            this.ctx.body = {
                code: 0,
                data: 'Push success'
            }
        }
    }
    async trigger_update_test_code () {
        const { email } = this.config.fe_project_update_test
        const { other } = this.ctx.service
        this.ctx.body = {
            code: 0,
            msg: '触发成功，结果会通知邮箱：' + email,
            data: other.fe_project_update()
        }
    }
}

module.exports = ExportController
