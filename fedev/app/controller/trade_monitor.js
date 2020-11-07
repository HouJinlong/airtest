const Controller = require('egg').Controller
const { typeConf } = require('../../config/tradeMonitor')
const { getDay, TIME } = require('../utils/date')

class TradeMonitorController extends Controller {
    // 首页
    async index () {
        const { compareDate, baseDate, type } = this.ctx.query
        let pageQuery
        if (compareDate && baseDate && type) {
            pageQuery = {
                type,
                compareDate,
                baseDate
            }
        } else {
            const todayStartTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
            const yesterdayStartTime = todayStartTime - TIME.ONE_DAY_MILLISECOND
            const yesterday = getDay(yesterdayStartTime)
            const today = getDay(todayStartTime)

            pageQuery = {
                type: typeConf[0].value,
                compareDate: yesterday,
                baseDate: today
            }
        }

        const pageData = {
            typeConf,
            pageQuery
        }
        return await this.ctx.render('trade_monitor/index.tpl', pageData)
    }

    async getChartData () {
        const { compareDate, baseDate, type } = this.ctx.query
        const todayStartTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        const weekCompareDayStartTime = todayStartTime - TIME.ONE_DAY_MILLISECOND * 7
        const compareDayStartTime = new Date(compareDate + ' 00:00').getTime()
        const baseDayStartTime = new Date(baseDate + ' 00:00').getTime()
        const isToday = baseDayStartTime === todayStartTime

        const weekCompareGio = await this.ctx.service.tradeMonitor.getGio({
            type,
            dayStartTime: weekCompareDayStartTime
        })
        const compareGio = await this.ctx.service.tradeMonitor.getGio({
            type,
            dayStartTime: compareDayStartTime
        })
        let baseGio
        if (isToday) {
            baseGio = await this.ctx.service.tradeMonitor.getGio({ isToday: 1, type })
        } else {
            baseGio = await this.ctx.service.tradeMonitor.getGio({
                type,
                dayStartTime: baseDayStartTime
            })
        }

        const chartData = this.ctx.service.tradeMonitor.getChartData([
            {
                dayStartTime: weekCompareDayStartTime,
                gioData: weekCompareGio
            }, {
                dayStartTime: compareDayStartTime,
                gioData: compareGio
            }, {
                isToday,
                dayStartTime: baseDayStartTime,
                gioData: baseGio
            }
        ])

        // console.log(chartData)

        this.ctx.body = {
            code: 0,
            data: chartData
        }
    }
}
module.exports = TradeMonitorController
