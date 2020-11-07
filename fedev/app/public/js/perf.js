
let symbolCnt = 0

function rgb () {
    // var r = Math.floor(Math.random() * 256)
    // var g = Math.floor(Math.random() * 256)
    // var b = Math.floor(Math.random() * 256)
    // var rgb = 'rgb(' + r + ',' + g + ',' + b + ')'
    const arrColor = [ '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0', '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700', '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0' ]
    return arrColor[(symbolCnt) % arrColor.length]
}
// 形状

function getSymbol () {
    const arrSymbol = [ 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'heart', 'droplet', 'arrow', 'star' ]
    return arrSymbol[(symbolCnt++) % arrSymbol.length]
}

// eslint-disable-next-line no-unused-vars
function drawLine (echartsIns, charts, title, optionData) {
    // console.log(charts)
    const color = [ 'rgba(23, 255, 243', 'rgba(255,100,97' ]
    const seriesData = []
    symbolCnt = 0

    for (let i = 0; i < charts.legend.length; i++) {
        let x = i
        if (x > color.length - 1) {
            x = color.length - 1
        }
        const data = {
            name: charts.legend[i],
            type: 'line',
            color: [ rgb() ],
            smooth: true,
            symbol: getSymbol(),
            data: charts.value[ i ],
            markLine: {
                precision: 0,
                label: {
                    // position: 'center',
                    // formatter: '均线:{c}'
                },
                data: [
                    { type: 'average', name: '平均值' }
                ]
            }
        }
        if (optionData && optionData.hideAverage) {
            delete data.markLine
        }
        seriesData.push(data)
    }

    const option = {
        backgroundColor: '#1b1b1b',
        title: {
            text: title,
            textAlign: 'center',
            top: 'bottom',
            left: '50%',
            textStyle: {
                color: '#6699FF'
            }
        },
        color: [ '#6699FF' ],
        animation: true,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false
            }
        },
        legend: {
            data: charts.names,
            textStyle: {
                fontSize: 12,
                color: '#6699FF'
            },
            right: '5%'
        },
        grid: {
            top: '16%',
            left: '4%',
            right: '4%',
            bottom: '12%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: charts.lineX,
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgb(255,255,255,0.6)'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'rgb(255,255,255,0.6)'
                }

            }
        },
        yAxis: {
            min: 'dataMin',
            name: charts.unit,
            type: 'value',
            axisLabel: {
                formatter: '{value}',
                textStyle: {
                    color: 'rgb(255,255,255,0.6)'
                }
            },
            splitLine: {
                show: false
                // lineStyle: {
                //     type: 'dashed',
                //     color: 'rgb(255,255,255,0.3)'
                // }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgb(255,255,255,0.6)'
                }
            }
        },
        series: seriesData

    }

    if (optionData && optionData.toolTipFomatter) {
        option.tooltip.formatter = optionData.toolTipFomatter
    }
    if (optionData && optionData.yMax) {
        option.yAxis.max = optionData.yMax
    }

    // console.log(option)
    echartsIns.setOption(option)
}

// eslint-disable-next-line no-unused-vars
function hidechartsLine (echartsIns, charNamesHide) {
    const hideOption = {}
    charNamesHide.forEach(function (item) {
        hideOption[item] = false
    })
    echartsIns.setOption({
        legend: {
            selected: hideOption
        }
    })
}


// eslint-disable-next-line no-unused-vars
function drawCol (echartsIns, data, title) {
    // console.log(data)
    const list = data.col
    const maxCol = list.length - 2
    const cnt = data.cnt
    const avg = data.avg
    const p50 = data.p50
    const timeList = []

    // 计算横坐标数组
    let tb = -0.1
    for (let i = 0, len = list.length; i < len; i++) {
        timeList.push(tb.toFixed(1))
        tb += 0.1
    }

    // 计算累计百分数
    function getTotalPercent (ind, cnt) {
        let sum = 0
        const len = list.length
        if (ind >= len) {
            return '数据错误'
        }
        const unValidCnt = list[ 0 ]

        for (let i = 1; i <= ind; i++) {
            sum += list[i]
        }
        return (sum * 100 / (cnt - unValidCnt)).toFixed(3)
    }

    const option = {
        backgroundColor: '#1b1b1b',
        title: {
            text: title,
            textAlign: 'center',
            top: 'bottom',
            left: '50%',
            textStyle: {
                color: '#6699FF'
            }
        },
        color: [ '#6699FF' ],
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter (params) {
                const t1 = params[0].axisValue
                let t2
                let desc1 = ''
                let desc2 = ''
                const ind = params[0].dataIndex
                const curPercent = (params[0].data * 100 / cnt).toFixed(3)
                const totolPercent = getTotalPercent(ind, cnt)
                const maxAttrVal = maxCol * 0.1
                if (t1 < 0) {
                    desc1 = '没获取到数据的占'
                } else if (t1 >= maxAttrVal) {
                    desc1 = '超过' + maxAttrVal + 's的占'
                } else {
                    t2 = (+t1 + 0.1).toFixed(1)
                    desc1 = '耗时在[' + t1 + '-' + t2 + ']s 之间的占'
                    desc2 = totolPercent + '%的用户耗时<' + t2 + 's '
                }


                return '上报数据的用户总数是' + cnt + '<br/>' +
                        '中位数是' + p50 + 'ms,平均值是' + avg + 'ms<br/>' +
                        desc1 + curPercent + '%<br/>' + desc2
            }
        },
        grid: {
            containLabel: true
        },
        xAxis: {
            unit: '秒',
            name: '耗时(s)',
            scale: true,
            min: 'dataMin',
            type: 'category',
            data: timeList,
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgb(255,255,255,0.6)'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'rgb(255,255,255,0.6)'
                }

            }
        },
        yAxis: {
            name: '用户数',
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: 'rgb(255,255,255,0.3)'
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgb(255,255,255,0.6)'
                }
            }
        },
        series: [{
            name: '用户数',
            data: list,
            barWidth: '60%',
            type: 'bar'
        }]
    }

    echartsIns.setOption(option)
}


(function () {
    // eslint-disable-next-line no-undef
    $('[data-type="date"]').datepicker({
        language: 'zh-CN',
        todayHighlight: true,
        autoclose: true,
        format: 'yyyy-mm-dd'
    })
})()
