const Service = require('egg').Service
const { pageAttrConf, channelConf, pageIdConf } = require('../../config/perf')

class PerfService extends Service {
    // 返回一个页面所有渠道的页面加载总时间中位数
    async getAllChannelPerf (params) {
        const { pKey, startDate, endDate } = params

        // 计算所有渠道的pName, pKey是页面的名字，例如大类页是catg
        const arrChannel = Object.keys(channelConf)
        const pageId = pageIdConf[ pKey ].id
        const arrPName = []
        for (const channel of arrChannel) {
            arrPName.push(`${pageId}_${channel}_all`)
        }

        const query = {
            pName: arrPName,
            _date: { $gte: startDate, $lte: endDate }
        }
        const fields = {
            pageWholeTime_p50: true,
            _date: true,
            pName: true,
            cnt: true
        }
        // console.log(query, fields)
        const res = await this.ctx.model.Perf
            .find(query, fields)
            .sort({
                _date: 1
            })

        const arrDate = []
        const dateMap = {}
        const arrList = []
        const arrChannelName = []
        const arrCntList = []
        const regPName = /^\d+_([\w_]*?)_all$/
        for (let i = 0, len = res.length; i < len; i++) {
            const item = res[ i ]
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
                channel = mRes[ 1 ]
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
                arrCntList[ channelInd ] = []
            }
            arrList[ channelInd ][ dateInd ] = item.pageWholeTime_p50
            arrCntList[ channelInd ][ dateInd ] = item.cnt
            if (!arrChannelName[ channelInd ]) {
                arrChannelName[ channelInd ] = channelProp.name
            }
        }

        return {
            arrDate,
            legend: arrChannelName,
            arrList,
            arrCntList
        }

    }
    async getPerfReport (params) {
        const { week, lastWeek } = params
        const arrWeek = [ week, lastWeek ]
        // console.log(query, fields)
        const arrTmp = {}
        for (let i = 0, len = arrWeek.length; i < len; i++) {
            const week = arrWeek[i]
            const res = await this.ctx.model.Perf.aggregate([{
                $match: {
                    _date: {
                        $gte: week.startDate,
                        $lte: week.endDate
                    }
                }
            }]).group({
                _id: '$pName',
                cnt: { $sum: '$cnt' },
                avg: { $avg: '$pageWholeTime_p50' }
            })
            // console.log(`res.length:`, res.length)
            for (const item of res) {
                if (!arrTmp[ item._id ]) {
                    arrTmp[ item._id ] = []
                }

                arrTmp[ item._id ][ i ] = { avg: item.avg, cnt: item.cnt }
            }
        }
        // console.log(arrTmp)
        // 计算性能指标
        const data = {
            tag: [],
            list: [],
            date: [ week, lastWeek ]
        }


        const arrChannel = Object.keys(channelConf)
        for (const pKey in pageIdConf) {
            const pageId = pageIdConf[ pKey ].id
            const pageName = pageIdConf[ pKey ].name
            let channelCnt = 0
            for (const [ ind, channel ] of arrChannel.entries()) {
                // 统计报表里暂时屏蔽id>4的渠道，等所有页面渠道都一致了再统计
                if (ind > 4) {
                    continue
                }
                const channelName = channelConf[ channel ].name
                let pKey = ''
                pKey = `${pageId}_${channel}_all`

                if (!arrTmp[ pKey ]) {
                    continue
                }
                const thisWeekItem = arrTmp[pKey][0] || {}
                const lastWeekItem = arrTmp[pKey][1] || {}
                data.list.push({
                    pageName,
                    channelName,
                    pKey,
                    avgLastWeek: Math.round(lastWeekItem.avg),
                    avgThisWeek: Math.round(thisWeekItem.avg),
                    cntLastWeek: lastWeekItem.cnt,
                    cntThisWeek: thisWeekItem.cnt
                })
                channelCnt++
            }

            data.tag.push({
                pageName,
                channelCnt
            })
        }

        return data
    }

    // 计算一段时间的页面加载时间中位数均值与某一天的页面加载时间中位数对比
    async getCompData (params) {
        const { week, cDate } = params
        const arrTmp = {}

        // 计算周平均数
        const res = await this.ctx.model.Perf.aggregate([{
            $match: {
                _date: {
                    $gte: week.startDate,
                    $lte: week.endDate
                }
            }
        }]).group({
            _id: '$pName',
            cnt: { $sum: '$cnt' },
            avg: { $avg: '$pageWholeTime_p50' }
        })
        for (const item of res) {
            if (!arrTmp[ item._id ]) {
                arrTmp[ item._id ] = []
            }

            arrTmp[ item._id ] = { avg: Math.round(item.avg), cnt: item.cnt }
        }

        // 获取对比日的各项指标

        const res2 = await this.ctx.model.Perf.find({
            _date: cDate
        }, {
            pName: true,
            pageWholeTime_p50: true
        })

        // 进行对比
        for (const item of res2) {
            const pName = item.pName
            const dItem = arrTmp[ pName ]
            if (!dItem) {
                console.warn(`pName:${pName} 上周均值不存在`)
                delete arrTmp[pName]
                continue
            }
            dItem.cDay = item.pageWholeTime_p50
            if (!item.pageWholeTime_p50) {
                dItem.cDay = '-'
                dItem.diff = '-'
                dItem.warn = false
            } else {
                dItem.diff = Math.round(item.pageWholeTime_p50 - dItem.avg)
                dItem.warn = dItem.diff >= 50
            }
        }

        const data = {
            page: {},
            date: { ...week, cDate }
        }
        const arrChannel = Object.keys(channelConf)
        for (const pKey in pageIdConf) {
            const pageId = pageIdConf[ pKey ].id
            const pageName = pageIdConf[ pKey ].name
            const list = []
            for (const channel of arrChannel) {
                const channelName = channelConf[ channel ].name
                let pKey = ''
                pKey = `${pageId}_${channel}_all`

                const item = arrTmp[pKey] || {}
                list.push({
                    channelName,
                    pKey,
                    ...item
                })
            }
            data.page[pageName] = list
        }

        return data
    }


    // 返回页面通用性能指标配置
    async getPageAttr () {
        const arrKey1 = [],
            arrKey2 = [],
            arrAttr1 = [],
            arrAttr2 = []
        for (const key in pageAttrConf) {
            const val = pageAttrConf[ key ]
            arrKey1.push(key + '_p50')
            arrAttr1.push(val + '中位数')

            arrKey2.push(key + '_avg')
            arrAttr2.push(val + '均值')

        }
        return {
            arrAttrKey: arrKey1.concat(arrKey2),
            arrAttrName: arrAttr1.concat(arrAttr2)
        }
    }

    // 返回一个页面某个渠道所有性能指标
    async getPagePerf (params) {
        const { pKey, channel, os, startDate, endDate } = params
        const pageId = pageIdConf[ pKey ].id
        const pName = `${pageId}_${channel}_${os}`
        const query = {
            pName,
            _date: { $gte: startDate, $lte: endDate }
        }

        // 页面通用性能指标配置
        const arrKey1 = [],
            arrKey2 = [],
            arrAttr1 = [],
            arrAttr2 = []
        for (const key in pageAttrConf) {
            const val = pageAttrConf[ key ]
            arrKey1.push(key + '_p50')
            arrAttr1.push(val + '中位数')

            arrKey2.push(key + '_avg')
            arrAttr2.push(val + '均值')

        }
        const arrAttrKey = arrKey1.concat(arrKey2)
        const arrAttrName = arrAttr1.concat(arrAttr2)

        const fields = {}
        Object.keys(pageAttrConf).forEach(attr => {
            fields[attr + '_col'] = false
        })
        // console.log(query, fields)
        const res = await this.ctx.model.Perf.find(query, fields).sort({
            _date: 1
        })

        const arrDate = []
        const arrData = []
        for (let i = 0, len = res.length; i < len; i++) {
            const item = res[i]
            arrDate.push(item._date)
            for (let j = 0, kLen = arrAttrKey.length; j < kLen; j++) {
                if (!Array.isArray(arrData[j])) {
                    arrData[j] = []
                }
                arrData[j].push(item[arrAttrKey[j]])
            }
        }


        return {
            arrDate,
            legend: arrAttrName,
            arrList: arrData,
            arrAttrKey
            // arrCntList
        }
    }

    // 返回一个页面某个渠道某一天某个性能指标的时间柱状图数据
    async getPerfCol (params) {
        const { pKey, channel, os, date, attr } = params
        const pageId = pageIdConf[ pKey ].id
        const pName = `${pageId}_${channel}_${os}`


        const query = {
            pName,
            _date: date
        }
        const fields = {
            [ attr + '_col' ]: true,
            [ attr + '_p50' ]: true,
            [ attr + '_avg' ]: true,
            cnt: true
        }

        const result = await this.ctx.model.Perf.find(query, fields)
        let res = {
            pName,
            date,
            attr,
            col: [],
            p50: void 0,
            avg: void 0
        }
        if (result.length > 0) {
            const first = result[0]
            res = {
                ...res,
                cnt: first.cnt,
                col: first[ attr + '_col' ],
                p50: first[ attr + '_p50' ],
                avg: first[ attr + '_avg']
            }
        }

        return res
    }

    // 返回一个页面某个渠道某一天某个性能指标的一个区间的所有日志记录
    async getLogList (params) {
        const { pKey, channel, os, date, attr, qAttr, offset, limit, order, sort } = params
        const pageId = pageIdConf[ pKey ].id

        const query = {
            pageId,
            _date: date,
            [attr]: qAttr
        }
        channel !== 'all' && (query.channel = channel)
        os !== 'all' && (query.os = os)

        // let fields = {
        //     channel: true,
        //     os: true,
        //     pageId: true,
        //     _date: true,
        //     [ attr ]: true,
        //     network: true,
        //     lat: true,
        //     lng: true,
        //     url: true,
        //     userId: true,
        //     deviceId: true,
        //     version: true
        // }
        // console.log('offset:' + offset, 'limit:' + limit)
        const cnt = await this.ctx.model.Plog.find(query).count()
        // console.log(`cnt:${cnt}`)
        let rows = []
        if (cnt > 0) {
            rows = await this.ctx.model.Plog
                .find(query)
                .sort({
                    [ sort || attr ]: order === 'asc' ? 1 : -1
                })
                .skip(offset)
                .limit(limit)
        }

        return {
            total: cnt,
            rows
        }

    }
}

module.exports = PerfService
