const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '30m',
      type: 'worker',
    //   immediate: true,
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    console.log('subscribe')
    const {task} = this.ctx.service
    await task.updateAllIssues({
        emailNotification:true
    });
  }

}


module.exports = UpdateCache;
