{% import "temp.html" as temp %}
<!DOCTYPE html>
<html lang="en">
{{ temp.head('交易节点数据监控') }}
<body>
    {{ temp.tradeMonitorHeader() }}
    <div class="container">
    <div class="panel panel-default">
            <div class="panel-heading">
                筛选
            </div>
            <div class="panel-body">
                <div class="row p10" >
                    <div class="col-xs-2">
                        <div class="form-group">
                            <label for="typeConf">
                                数据指标
                            </label>
                            <select class="form-control filter" data-id="typeConf" >
                                {% for item in typeConf %}
                                    <option value="{{item.value}}" {% if pageQuery.type == item.value %}selected="selected" {% endif %} >{{item.name}}</option>
                                {% endfor %}
                            </select>
                        </div>
                    </div>

                    <div class="col-xs-2">
                        <div class="form-group">
                            <label>选择比较日期</label>
                            <input type="text" class="form-control filter" data-type="date" data-id="compareDate" placeholder="选择日期" value="{{pageQuery.compareDate}}">
                        </div>
                    </div>

                    <div class="col-xs-2">
                        <div class="form-group">
                            <label>选择查看日期</label>
                            <input type="text" class="form-control filter" data-type="date" data-id="baseDate" placeholder="选择日期" value="{{pageQuery.baseDate}}">
                        </div>
                    </div>

                    <div class="col-xs-4">
                        <div class="form-group">
                            <!-- div用来占位 -->
                            <div style="max-width: 100%;margin-bottom: 5px;font-weight: 700;">&nbsp;</div>
                            <button id="btn_query" type="button" class="btn btn-default ">查 询</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-body">
                <div id="gio-charts-line" style="width:100%;height:600px;"></div>
            </div>
        </div>
      </div>
      {{ temp.perfPublicJs() }}

    <script>
    function chartToolTipFomatter(params) {
        console.log(params)
        function getTimeStr (day, time, type) {
            if (day == '今天') {
                const d = new Date()
                day = d.getFullYear() + '-' + padzero(d.getMonth() + 1, 2) + '-' + padzero(d.getDate(), 2)
            }
            const timeStart = new Date(day + ' ' + time)
            const timeEnd = new Date(timeStart.getTime() + 1000 * 60 * 5)
            const dayStrMap = [ '周日', '周一', '周二', '周三', '周四', '周五', '周六']
            var dayStr = padzero(timeStart.getMonth() + 1, 2) + '/' + padzero(timeStart.getDate(), 2)
            return type === 1 ? dayStr : dayStr + ' ' + dayStrMap[timeStart.getDay()] + ' ' + padzero(timeStart.getHours(), 2) + ':' + padzero(timeStart.getMinutes(), 2) + '~' + padzero(timeEnd.getHours(), 2) + ':' + padzero(timeEnd.getMinutes(), 2)
        }
        let relVal = ''
        if (params.length === 3 && !isNaN(params[2].value)) {
            if (!isNaN(params[1].value)) {
                relVal += '与' + getTimeStr(params[1].seriesName, params[1].name, 1) + '对比：' + getGrowthRate(params[1].value, params[2].value) + '%<br/>'
            }
            if (!isNaN(params[0].value)) {
                relVal += '与一周前对比：' + getGrowthRate(params[0].value, params[2].value) + '%<br/>'
            }
        } else if (params.length === 2 && params[1].componentIndex === 2 && !isNaN(params[1].value)) {
            var txt = params[0].componentIndex === 0 ? '一周前' : getTimeStr(params[0].seriesName, params[0].name, 1)
            relVal += '与' + txt + '对比：' + getGrowthRate(params[0].value, params[1].value) + '%<br/>'
        }
        for (var i = 0; i < 3; i++) {
            if (params[i]) {
                relVal += getTimeStr(params[i].seriesName, params[i].name) + '&nbsp&nbsp&nbsp&nbsp<strong>' + (!isNaN(params[i].value) ? params[i].value : '-') + '</strong><br/>'
            }
        }

        return relVal
    }
    function padzero (n, len) {
        if (n >= 10) {
            return n
        }
        let str = '' + n
        let l = str.length
        while (l < len) {
            str = '0' + str
            l++
        }
        return str
    }
    function getGrowthRate (prev, now) {
        if (prev === 0) {
            return now * 100
        } else {
            return parseInt(((now - prev) / prev).toFixed(2) * 100)
        }
    }
    ;(function(){
        var elCompareDate = $('input[data-id="compareDate"]')
        var elBaseDate = $('input[data-id="baseDate"]')
        var elType = $('select[data-id="typeConf"]')

        function getDataAndDraw() {
            var compareDate = elCompareDate.val()
            var baseDate = elBaseDate.val()
            var type = elType.val()

            $.ajax({
                url: '/trade_monitor/api/getChartData',
                data: {
                    compareDate,
                    baseDate,
                    type
                },
                success: function(res){
                    console.log(res)
                    var data = res.data
                    var charts = {
                        unit: '次数',
                        legend: data['typeArray'],
                        lineX: data['timeArray'],
                        value: data['arrList']
                    }
                    var echartsIns = echarts.init(document.getElementById('gio-charts-line'))
                    var typeName = $('select[data-id="typeConf"] option:selected').text()
                    var max = 0
                    data['arrList'].forEach(list=>{
                        list.forEach(item=>{
                            if (item > max) {
                                max = item
                            }
                        })
                    })
                    drawLine(echartsIns ,charts, typeName + ' - gio曲线', {hideAverage: true, toolTipFomatter: chartToolTipFomatter, yMax: max * 2})
                }
            })
        }

        getDataAndDraw()

        function timoutFunc () {
            timeoutInst = setTimeout(function() {
                getDataAndDraw()
                timoutFunc()
            }, 5 * 60 * 1000)
        }

        var timeoutInst = null
        timoutFunc()

        $('#btn_query').on('click',function(e){
            var compareTime = new Date(elCompareDate.val() + ' 00:00').getTime()
            var baseTime = new Date(elBaseDate.val() + ' 00:00').getTime()
            var todayTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
            if (compareTime >= todayTime) {
                alert('比较日期需要小于今日')
                return
            }
            if (baseTime > todayTime) {
                alert('查看的日期不能大于今日')
                return
            }
            if (compareTime >= baseTime) {
                alert('比较日期需要小于查看日期')
                return
            }
            getDataAndDraw()
        })

    })()
    </script>
</body>
</html>
