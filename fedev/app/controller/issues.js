const Controller = require('egg').Controller

class IssuesController extends Controller {
    async remove () {
        const {issues} = this.ctx.service
        const {id} = this.ctx.query
        if(id) {
            try {
                await issues.remove({id})
                this.ctx.body = {
                    code: 0,
                    msg: '成功删除'
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
                msg: '缺少参数id'
            }
        }
    }

    async update () {
        const {issues,sentry} = this.ctx.service
        const {id, people = '', status,ua} = this.ctx.query


        if(id) {
            try {
                var ret = (await issues.get({id: id}))[0]
                let oldUa  = ret.ua;
                let obj = Object.assign({},ret,{people, status,ua});
                if(ua!==oldUa){
                    obj = await sentry.getIssuesEvents(obj,false);
                }
                await issues.update(id, obj)
                this.ctx.body = {
                    code: 0,
                    msg: '修改成功',
                    data: obj
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
                msg: '缺少参数id'
            }
        }
    }

    async pull () {
        const {task} = this.ctx.service
        const {project} = this.ctx.query
        try {
            if(project) {
                await task.updateAllIssues({
                    sentryName: project
                })
            }else{
                await task.updateAllIssues()
            }
            this.ctx.body = {
                code: 0,
                msg: '拉取成功'
            }
        } catch (error) {
            this.ctx.body = {
                code: 2,
                msg: error.toString()
            }
        }
    }
}

module.exports = IssuesController
