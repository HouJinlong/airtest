// app/controller/home.js
const Controller = require('egg').Controller
const { pageAttrConf, channelConf, pageIdConf, osConf } = require('../../config/perf')
const { getBeforeDay, getYesterday } = require('../utils/date')

class PerfController extends Controller {
    // 首页
    async index () {
        let { pKey, startDate, endDate } = this.ctx.query
        endDate = endDate || getYesterday()
        startDate = startDate || getBeforeDay(endDate, 30)
        // 页面配置
        const arrPageConf = []
        for (const pKey in pageIdConf) {
            arrPageConf.push({
                pKey,
                name: pageIdConf[ pKey ].name
            })
        }
        const data = {
            query: {
                ...this.ctx.query,
                startDate,
                endDate
            },
            arrPageConf,
            pKey
        }
        let res
        try {
            if (!pKey) {
                res = {
                    arrDate: [],
                    legend: [],
                    arrList: [],
                    arrCntList: []
                }
            } else {
                const params = {
                    pKey,
                    startDate,
                    endDate: endDate || startDate
                }
                res = await this.ctx.service.perf.getAllChannelPerf(params)

            }

            data.forTpl = res

        } catch (err) {
            this.ctx.logger.error(err)
            // todo
        }

        return await this.ctx.render('perf/index.tpl', data)
    }

    // 性能报告
    async getReport () {
        const weekEnd = getYesterday()
        const weekStart = getBeforeDay(weekEnd, 6)
        const lastWeekEnd = getBeforeDay(weekStart, 1)
        const lastWeekStart = getBeforeDay(lastWeekEnd, 6)
        const params = {
            week: { startDate: weekStart, endDate: weekEnd },
            lastWeek: { startDate: lastWeekStart, endDate: lastWeekEnd }
        }

        const data = {}
        try {
            const res = await this.ctx.service.perf.getPerfReport(params)
            data.forTpl = res
        } catch (err) {
            data.forTpl = []
            this.ctx.logger.error(err)
        }

        return await this.ctx.render('perf/report.tpl', data)
    }

    async getCompData () {
        let data = {
            code: 1,
            msg: `错误`,
            data: []
        }
        const yesterDay = getYesterday()
        const lastWeekEnd = getBeforeDay(yesterDay, 1)
        const lastWeekStart = getBeforeDay(lastWeekEnd, 6)
        try {
            const res = await this.ctx.service.perf.getCompData({
                week: {
                    startDate: lastWeekStart,
                    endDate: lastWeekEnd
                },
                cDate: yesterDay
            })

            const page = res.page
            const arr = [
                '## 昨日页面性能变化趋势',
                '---'
            ]
            for (const pageName in page) {
                arr.push(`## ${pageName}`)
                const list = page[ pageName ]
                for (const item of list) {
                    let str = `- ${item.channelName},前七天均值:${item.avg},昨日:${item.cDay || '-'},变化趋势:`
                    str += item.warn ? `*${item.diff || '-'}*` : (item.diff || '-')
                    arr.push(str)
                }
                arr.push('---')
            }
            arr.push('[详细信息查看](http://fedev.djtest.cn:17001/perf/report)')

            data = {
                code: 0,
                msg: 'success',
                data: arr.join('\n\n')
            }

        } catch (err) {
            this.ctx.logger.error(err)
            data.msg = err
        }

        this.ctx.body = data
    }

    async pagePerf () {
        let { pKey, channel, os, startDate, endDate } = this.ctx.query
        channel = channel || 'dj_app'
        os = os || 'all'
        endDate = endDate || getYesterday()
        startDate = startDate || getBeforeDay(endDate, 30)
        // 页面配置
        const arrPageConf = []
        for (const k in pageIdConf) {
            arrPageConf.push({
                pKey: k,
                name: pageIdConf[ k ].name
            })
        }
        // 渠道配置
        const arrChannelConf = []
        for (const cKey in channelConf) {
            arrChannelConf.push({
                cKey,
                name: channelConf[ cKey ].name
            })
        }
        // os配置
        const arrOsConf = []
        for (const osKey in osConf) {
            arrOsConf.push({
                osKey,
                name: osConf[osKey]
            })
        }


        const data = {
            query: {
                ...this.ctx.query,
                pKey,
                channel,
                os,
                startDate,
                endDate
            },
            pKey,
            attr: '全部指标',
            arrPageConf,
            arrChannelConf,
            arrOsConf
        }

        let res
        if (!pKey) {
            // 没有传页面key,直接返回空数据
            res = {
                arrDate: [],
                legend: [],
                arrList: [],
                arrCntList: []
            }
        } else {

            const params = {
                pKey,
                channel,
                os,
                startDate,
                endDate: endDate || startDate
            }
            res = await this.ctx.service.perf.getPagePerf(params)

        }

        data.forTpl = res
        await this.ctx.render('perf/perf.tpl', data)
    }

    // 查看某个页面一段时间的性能数据
    async pageByDate () {
        const { pName, startDate, endDate } = this.ctx.query
        const params = {
            pName,
            startDate,
            endDate: endDate || startDate
        }
        let res
        try {
            res = await this.ctx.service.perf.getPageByDate(params)
            this.ctx.body = {
                code: 0,
                msg: 'success',
                data: res
            }
        } catch (err) {
            this.ctx.logger.error(err)
            this.ctx.body = {
                code: 1,
                msg: err
            }
        }
    }

    // 查看某个页面所有渠道某一段时间的某个指标的中位数
    async getChannelPerfByDate () {
        const arrChannel = Object.keys(channelConf)
        // pKey是页面的名字，例如大类页是catg
        const { pKey, startDate, endDate, attr } = this.ctx.query
        const pageId = pageIdConf[ pKey ].id
        const arrPName = []
        for (const c of arrChannel) {
            arrPName.push(`${pageId}_${c}_all`)
        }

        const params = {
            pName: arrPName,
            attr: `${attr}_p50`,
            startDate,
            endDate: endDate || startDate
        }

        const fields = {
            [`${attr}_p50`]: true,
            _date: true,
            pName: true,
            cnt: true
        }
        let res
        try {
            res = await this.ctx.service.perf.getPageByDate(params, fields)

            const arrDate = []
            const dateMap = {}
            const arrList = []
            const arrChannelName = []
            const arrCntList = []
            const regPName = /^\d+_([\w_]*?)_all$/
            for (let i = 0, len = res.length; i < len; i++) {
                const item = res[i]
                const date = item._date
                let dateInd = dateMap[ date ]
                if (typeof dateInd === 'undefined') {
                    arrDate.push(item._date)
                    dateMap[ date ] = arrDate.length - 1
                    dateInd = arrDate.length - 1
                }

                let channel = ''
                const mRes = regPName.exec(item.pName)
                if (mRes) {
                    channel = mRes[1]
                } else {
                    console.warn(`pName:${item.pName}格式不对`)
                    continue
                }
                const channelProp = channelConf[ channel ]
                if (typeof channelProp === 'undefined') {
                    console.warn(`channel:${channel}不存在`)
                    continue
                }
                const channelInd = channelProp.ind
                // console.log(`channelInd:${channelInd},dateInd:${dateInd}`)
                if (!arrList[ channelInd ]) {
                    // 渠道数组不存在
                    arrList[ channelInd ] = []
                    arrCntList[channelInd] = []
                }
                arrList[channelInd][dateInd] = item[attr + '_p50']
                arrCntList[ channelInd ][ dateInd ] = item.cnt
                if (!arrChannelName[ channelInd ]) {
                    arrChannelName[ channelInd ] = channelProp.name
                }

            }

            const data = {
                pKey,
                attr,
                arrDate,
                arrChannelName,
                arrList,
                arrCntList
            }

            this.ctx.body = {
                code: 0,
                msg: 'success',
                data
            }
        } catch (err) {
            this.ctx.logger.error(err)
            this.ctx.body = {
                code: 1,
                msg: err
            }
        }
    }

    // 返回页面性能指标配置
    async getPageAttrConf () {
        const res = []
        for (const key in pageAttrConf) {
            const val = pageAttrConf[ key ]
            res.push({
                name: val + '中位数',
                key: key + '_p50'
            })
            res.push({
                name: val + '均值',
                key: key + '_avg'
            })
        }
        this.ctx.body = {
            code: 0,
            msg: 'success',
            data: res
        }
    }

    // 返回某一个页面某一天某个性能指标的柱状图
    async getAttrCol () {
        let { pKey, channel, os, date, attr } = this.ctx.query
        channel = channel || 'dj_app'
        os = os || 'all'
        date = date || getYesterday()
        attr = attr || 'pageWholeTime'
        // 页面配置
        const arrPageConf = []
        for (const k in pageIdConf) {
            arrPageConf.push({
                pKey: k,
                name: pageIdConf[ k ].name
            })
        }
        // 渠道配置
        const arrChannelConf = []
        for (const cKey in channelConf) {
            arrChannelConf.push({
                cKey,
                name: channelConf[ cKey ].name
            })
        }
        // os配置
        const arrOsConf = []
        for (const osKey in osConf) {
            arrOsConf.push({
                osKey,
                name: osConf[osKey]
            })
        }

        // 性能指标配置
        const arrAttrConf = []
        for (const aKey in pageAttrConf) {
            arrAttrConf.push({
                aKey,
                name: pageAttrConf[aKey]
            })
        }

        const data = {
            query: {
                ...this.ctx.query,
                pKey,
                channel,
                os,
                date,
                attr
            },
            pKey,
            attr,
            arrPageConf,
            arrChannelConf,
            arrOsConf,
            arrAttrConf
        }

        let res
        try {
            const params = {
                pKey,
                channel,
                os,
                date,
                attr
            }
            res = await this.ctx.service.perf.getPerfCol(params)

        } catch (err) {
            this.ctx.logger.error(err)
        }

        data.forTpl = res
        await this.ctx.render('perf/attr_col.tpl', data)
    }

    // api, 获取某个页面某个性能指标满足条件的日志列表
    async getLogList () {
        let { pKey, channel, os, date, attr, attrVal, limit = 100, offset = 0, order = 'asc', sort } = this.ctx.query
        channel = channel || 'dj_app'
        os = os || 'all'
        date = date || getYesterday()
        attr = attr || 'pageWholeTime'
        let data = {
            code: 1,
            msg: `参数attrVal为空`,
            data: []
        }


        if (!attrVal) {
            data.msg = '参数attrVal为空'
            return this.ctx.body = data
        }

        const qAttr = {}
        const arrAttrVal = attrVal.split('|')
        if (arrAttrVal[ 0 ] !== '#') {
            qAttr.$gt = arrAttrVal[ 0 ]
        }
        if (arrAttrVal[ 1 ] !== '#') {
            qAttr.$lte = arrAttrVal[ 1 ]
        }

        const params = {
            pKey,
            channel,
            os,
            date,
            attr,
            qAttr,
            offset: +offset,
            limit: +limit,
            order,
            sort
        }

        try {
            const res = await this.ctx.service.perf.getLogList(params)
            data = {
                code: 0,
                msg: 'success',
                data: res
            }
        } catch (err) {
            data.msg = 'getPagePerf fail: ' + err
        }


        this.ctx.body = data
    }


}

module.exports = PerfController
