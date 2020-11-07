// app/controller/home.js
const Controller = require('egg').Controller

const {status, filterConfig} = require('../../config/issues')
class SentryController extends Controller {
    // 首页
    async index () {
        const {issues, project, configuration} = this.ctx.service


        const {project: queryProject, people: queryPeople, status: queryStatus, firstSeen, count, userCount, lastSeen} = this.ctx.query
        let query = {}
        queryProject && (query.project = queryProject)
        queryPeople && (query.people = queryPeople)
        queryStatus && (query.status = queryStatus)
        firstSeen && (query.firstSeen = {
            '$gt': new Date(new Date(firstSeen + ' 8:00:00').toISOString())
        })
        lastSeen && (query.lastSeen = {
            '$gt': new Date(new Date(lastSeen + ' 8:00:00').toISOString())
        })
        count && (query.count = {
            '$gte': count
        })
        userCount && (query.userCount = {
            '$gte': userCount
        })

        let obj = {}
        // 所有项目
        let projectsList = await project.get()
        obj.projects = {}
        projectsList.forEach((v) => {
            obj.projects[v.sentryName] = v
        })
        obj.info = {}
        obj.issuesList = await issues.get(query)
        //条件恢复
        obj.query = query
        obj.query = query
        obj.query.firstSeen = firstSeen
        obj.query.lastSeen = lastSeen
        obj.query.count = count
        obj.query.userCount = userCount
        let data = await configuration.get()
        obj.people = data.people
        obj.status = status
        await this.ctx.render('sentry/index.tpl', obj)
    }
    // 配置页
    async configuration () {
        const {configuration} = this.ctx.service
        let data = await configuration.get()
        await this.ctx.render('sentry/configuration.tpl', {data, filterConfig})
    }
    // 所有项目列表页
    async projects () {
        const {project} = this.ctx.service
        const projects = await project.get()
        await this.ctx.render('sentry/projects.tpl', { projects })
    }
    // 报告页
    async report(){

        const {issues,project} = this.ctx.service
        let projectsList = await project.get()
        let projects = {}
        projectsList.forEach((v) => {
            projects[v.sentryName] = v
        })
        let data = {};
        try {
            data = await issues.getReport()
        } catch (err) {
            data = {}
            this.ctx.logger.error(err)
        }
        await this.ctx.render('sentry/report.tpl', { data,projects})
    }
}

module.exports = SentryController
