const Service = require('egg').Service
var sd = require('silly-datetime');
const sendEmail = require('../utils/sendEmail')
class TaskService extends Service {
    // sentryName[拉取项目sentryName] 不传默认更新所有的
    // emailNotification[Boolean] 是否邮件通知   默认不通知
    async updateAllIssues({sentryName,emailNotification}={}){
        const {sentry,issues,project,configuration} = this.ctx.service
        // 所有项目
        const allProject = await project.get(sentryName&&{sentryName});
        // 过滤条件
        const filterArr = await configuration.getFilter();
        //存储新的错误用于发邮件通知
        // {
        //     邮箱:{
        //         项目名:[]
        //         项目名:[]
        //     }
        //     邮箱:{
        //         项目名:[]
        //     }
        //     ...
        // }
        let newIssues = {};

        // 入库最新的Issues
        for(let i=0;i<allProject.length;i++){
            let indexProject = allProject[i]
            let projectName = indexProject.sentryName;

            // 先删除所有没有跟进的 Issues
            await issues.remove({people:'',project:projectName});

            const list = await sentry.list('sentry',indexProject,filterArr);
            let emailNewIssues;
            if(indexProject.email&&emailNotification){
                !newIssues[indexProject.email]&&(newIssues[indexProject.email]={});
                emailNewIssues = newIssues[indexProject.email];
            }
            for(let j=0;j<list.length;j++){
                let item = list[j];

                // 根据ua重新计算
                item = await sentry.getIssuesEvents(item,true);

                let isNew = await issues.add(item);
                if(isNew&&emailNewIssues){
                    !emailNewIssues[projectName]&&(emailNewIssues[projectName]=[]);
                    emailNewIssues[projectName].push(list[j])
                }
            }
            if(emailNewIssues&&emailNewIssues[projectName]&&emailNewIssues[projectName].length){
                // 如果有新错，更新项目更新时间
                await project.update(projectName,{
                    updateTime:sd.format(new Date(), 'YYYY-MM-DD HH:mm')
                });
            }
        }
        // 只有需要发送邮件通知的时候才发送
        if(emailNotification){
            sendEmail.sendIssueList(newIssues);
        }
        // 更新当天的 错误记录
        await issues.setTodayIssuesLog(new Date(sd.format(new Date(), 'YYYY-MM-DD')));
    }
}

module.exports = TaskService
