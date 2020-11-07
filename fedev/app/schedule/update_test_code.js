const Subscription = require('egg').Subscription

class ACache extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule () {
        return {
            cron: '0 0 1 * * *',
            type: 'worker'
        }
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe () {
        const { other } = this.ctx.service
        other.fe_project_update()
    }

}


module.exports = ACache
