const Service = require('egg').Service
const { TIME, getDay } = require('../utils/date')

class TradeMonitorService extends Service {
    async getGio (option) {
        let startTime,
            endTime
        if (option.isToday) {
            const todayStartTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
            startTime = todayStartTime
            endTime = new Date().getTime() - TIME.ONE_MINUTE_MILLISECOND * 6
        } else if (option.dayStartTime) {
            startTime = option.dayStartTime
            endTime = startTime + TIME.ONE_DAY_MILLISECOND
        }
        const query = {
            time: {
                $gte: startTime,
                $lt: endTime
            },
            type: option.type
        }
        const { TradeGio } = this.ctx.model
        const gioData = await TradeGio.find(query)
        console.log(`gioData length:${gioData.length}`)
        return gioData
    }

    getChartData (dataArr) {
        const timeArray = TIME.FIVE_MINUTE_ARRAY
        const typeArray = []
        const arrList = []

        dataArr.forEach(dataItem => {
            const array = []

            timeArray.forEach(() => {
                array.push(null)
            })

            dataItem.gioData.forEach(gioItem => {
                const { time, data } = gioItem
                const timeIndex = parseInt((time - dataItem.dayStartTime) / (5 * TIME.ONE_MINUTE_MILLISECOND))
                array[timeIndex] = data
            })

            arrList.push(array)
            typeArray.push(dataItem.isToday ? '今天' : getDay(dataItem.dayStartTime))
        })

        return {
            typeArray,
            timeArray,
            arrList
        }
    }
}

module.exports = TradeMonitorService
