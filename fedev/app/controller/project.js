const Controller = require('egg').Controller
const sendEmail = require('../utils/sendEmail')


class ProjectController extends Controller {
    async add () {
        const {project} = this.ctx.service
        const {sentryName, name = '', docUrl = '', people = '', email = ''} = this.ctx.query

        // 检查name
        if(sentryName) {
            let ret = await project.get({sentryName})

            if(ret[0] && email && ret[0].email !== email) {
                // 若邮箱修改   发送测试地址
                console.log('修改邮箱', ret[0].email, email)
                try {
                    await sendEmail.sendtest(email,'【sentry新问题通知】【关联('+name || sentryName+')测试】' )
                } catch (error) {
                    this.ctx.body = {
                        code: 2,
                        msg: '【邮箱出错】' + error.toString()
                    }
                    return
                }
            }

            if(ret.length) {
                try {
                    await project.update(sentryName, {
                        name,
                        docUrl,
                        people,
                        email
                    })
                    this.ctx.body = {
                        code: 0,
                        msg: '修改成功'
                    }
                } catch (error) {
                    this.ctx.body = {
                        code: 2,
                        msg: error.toString()
                    }
                }
            }else{
                try {
                    await project.add({
                        sentryName,
                        name,
                        docUrl,
                        people,
                        email
                    })
                    this.ctx.body = {
                        code: 0,
                        msg: '添加成功'
                    }
                } catch (error) {
                    this.ctx.body = {
                        code: 2,
                        msg: error.toString()
                    }
                }
            }
        }else{
            this.ctx.body = {
                code: 1,
                msg: '缺少参数sentryName'
            }
        }
    }

    async remove () {
        const {project, issues} = this.ctx.service
        const {sentryName} = this.ctx.query
        if(sentryName) {
            try {
                await issues.remove({project: sentryName})
                await project.remove({sentryName})
                this.ctx.body = {
                    code: 0,
                    msg: '删除成功'
                }
            } catch (error) {
                this.ctx.body = {
                    code: 2,
                    msg: error.toString()
                }
            }
        }else{
            this.ctx.body = {
                code: 1,
                msg: '缺少参数sentryName'
            }
        }
    }
}

module.exports = ProjectController
