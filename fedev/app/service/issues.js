const Service = require('egg').Service
var sd = require('silly-datetime')
const {getBeforeDay, getToday} = require('../utils/date')
class IssuesService extends Service {
    async add ({id,url,title,metadata,firstSeen,lastSeen,count,userCount,project,people='',status=1,ua=''}={}) {
        const {Issues} = this.ctx.model
        let result = await Issues.find({id})
        if(result.length) {
            // 只有第一次 添加取 项目配置的负责人 更新问题状态
            await Issues.update({id}, {$set: {
                url,firstSeen,lastSeen,count,userCount,status
            }})
            return false
        }else{
            await Issues.create({id,url,title,metadata,firstSeen,lastSeen,count,userCount,project,people,status,ua})
            return true
        }
    }

    async get (params) {
        const {Issues} = this.ctx.model
        const result = await Issues.find(params)
        let issuesList = []
        result.forEach((v) => {
            issuesList.push({
                id: v.id,
                project: v.project,
                people: v.people,
                status: v.status,
                url: v.url,
                title: v.title,
                count: v.count,
                ua:v.ua,
                userCount: v.userCount,
                firstSeen: sd.format(v.firstSeen, 'YYYY-MM-DD HH:mm:ss'),
                lastSeen: sd.format(v.lastSeen, 'YYYY-MM-DD HH:mm:ss')
            })
        })
        return issuesList
    }

    async remove (params) {
        const {Issues} = this.ctx.model
        const { sentry } = this.ctx.service
        await sentry.delete(params.id)
        await Issues.remove(params)
    }

    async update (id, params) {
        const obj = {id: id}
        const {Issues} = this.ctx.model
        let result = await Issues.update(obj, {$set: params})
        return result
    }

    async getReport(){
        const { issues } = this.ctx.service
        const {IssuesLog} = this.ctx.model
        let today =  getToday();
        let oldday = getBeforeDay(today,7)
        let todayData = await issues.setTodayIssuesLog(today);
        let olddayData = await IssuesLog.find({time:new Date(oldday)},{logs:true});
        if(olddayData[0]){
            olddayData = olddayData[0].logs;
        }else{
            olddayData = [];
        }
        return {
            data:{
                todayData,
                olddayData
            },
            time:{
                today,
                oldday
            }
        }
    }

    async setTodayIssuesLog(time){
        const {Issues,IssuesLog} = this.ctx.model
        const logs = await Issues.aggregate([{
            $match: {
                'status':{
                    "$ne":3
                }
            }
        },{$group : {_id : "$project", count : {$sum : 1}}}]);
        await IssuesLog.update({time:new Date(time)},{logs},{upsert:true})
        // 删除15天前的数据
        await IssuesLog.remove({
            time:{
                "$lte":new Date(getBeforeDay(time,15))
            }
        })
        return logs;
    }
}

module.exports = IssuesService
