const Service = require('egg').Service
const filter = require('../utils/filterIssues')


class SentryService extends Service {
    // 从sentry 拉取 指定项目 经过过滤配置过滤后的错误列表
    async list (organization_slug = 'sentry', project = {}, filterIssueList = []) {
        if(!project.sentryName)return
        // read config
        const { issuesList, issuesDetail } = this.config.sentry

        // 获取sentry issues list
        let res
        try {
            let issuesListUrl = issuesList(organization_slug, project.sentryName)
            console.log(`issuesListUrl:${issuesListUrl}`)
            res = await this.ctx.curl(issuesListUrl, {
                data: {
                    statsPeriod: '24h', // "24h", "14d", and ""
                    sort: 'freq'
                }
            })
        } catch (e) {
            console.error(e)
        }

        let list = []
        if(res.data && res.data.length) {
            for (let item of res.data) {
                // 根据配置进行过滤
                if (filter(item, filterIssueList)) {
                    continue
                }

                list.push({
                    id: item.id,
                    project: project.sentryName,
                    url: issuesDetail(organization_slug, project.sentryName, item.id),
                    title: item.title,
                    metadata: item.metadata,
                    firstSeen: (new Date(item.firstSeen)),
                    lastSeen: (new Date(item.lastSeen)),
                    count: item.count,
                    userCount: item.userCount
                })
            }
        }


        console.log(`list length:${list.length}`)
        return list
    }
    // 从 sentry 删除错误
    async delete (issue_id) {
        if(!issue_id)return
        const { deleteIssues} = this.config.sentry
        let deleteIssuesUrl = deleteIssues(issue_id)
        console.log(`deleteIssuesUrl:${deleteIssuesUrl}`)
        let res = {}
        try {
            res  = await this.ctx.curl(deleteIssuesUrl, {
                method: 'DELETE'
            })
        } catch (e) {
            console.error(e)
        }
        if(res.status !== 404 && res.status !== 202) {
            throw Error((((res || {}).res || {}).statusMessage) || 'sentry删除失败')
        }
    }
    //  从 sentry 获取指定bug的所有错误事件，并通过ua进行过滤，重新计算 count userCount url status(count=0时更改status 为3已解决)
    async getIssuesEvents(issue,isTask){
        if(!(issue&&issue.id)) return {};
        // 是否批量任务
        if(isTask){
            // 批量任务去查询 ua
            issue = Object.assign({},issue,((await this.ctx.service.issues.get({id: issue.id}))[0]||{}))
        }
        // ua存在 或者不是批量任务(防止手动清空ua)  重新计算
        if(issue.ua||!isTask){
            const { issuesEvents} = this.config.sentry
            let issuesEventsUrl = issuesEvents(issue.id)
            let res  = await this.ctx.curl(issuesEventsUrl);
            let events = res.data;

            // ua 转正则
            let re;
            if(issue.ua){
                re = new RegExp(issue.ua.split('|').map(str=>{
                    // 转义非单词字符
                    return str.replace(/(?=\W)/g,'\\');
                }).join('|'));
            }else{
                re= /.^/;
            }
            let count = 0;
            let users = [];
            let url = issue.url.replace(/\/events\/\d*/,'');
            console.log(url);
            events.forEach(e => {
                // 查看该bug的每次产生ua是否满足过滤条件
                e.entries.forEach(i=>{
                    if(i.type=='request'){
                        if(i.data&&i.data.headers){
                            i.data.headers.forEach(o=>{
                                if(o[0]&&o[0]=="User-Agent"){
                                    if(!(o[1]&&re.test(o[1]))){
                                        if(count==0){
                                            // 重改错误地址 指向不符合过滤条件的最新错误
                                            url += '/events/'+e.id
                                        }
                                        // 记录数量
                                        count+=1;
                                        //根据ip 统计影响用户数
                                        if(e.user&&e.user.ip_address){
                                            if(users.indexOf(e.user.ip_address)==-1){
                                                users.push(e.user.ip_address);
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    }
                })
            });
            return Object.assign({},issue,{
                count,
                url,
                userCount:users.length,
                status:count==0?3:2
            });
        }else{
            return issue;
        }

    }
}

module.exports = SentryService
