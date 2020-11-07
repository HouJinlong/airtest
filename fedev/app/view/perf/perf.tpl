{% import "temp.html" as temp %}
<!DOCTYPE html>
<html lang="en">
<head>
    {{ temp.head('页面性能数据') }}
</head>
<body>
    {{ temp.perfHeader() }}
    <div class="container">
        <div class="panel panel-default">
            <div class="panel-heading">
                筛选

            </div>
            <div class="panel-body">
                <div class="row p10" >
                    <div class="col-xs-2">
                        <div class="form-group">
                            <label for="pageConf">
                                页面
                            </label>
                            <select class="form-control filter" data-id="pageConf" >
                                {% for item in arrPageConf %}
                                    <option value="{{item.pKey}}" {% if query.pKey == item.pKey %}selected="selected" {% endif %} >{{item.name}}</option>
                                {% endfor %}
                            </select>
                        </div>
                    </div>
                     <div class="col-xs-2">
                        <div class="form-group">
                            <label for="channelConf">渠道</label>
                            <select class="form-control filter" data-id="channelConf"  >
                                <option value="all">全部</option>
                                {% for item in arrChannelConf %}
                                    <option value="{{item.cKey}}" {% if query.channel==item.cKey %}selected="selected" {% endif %}>{{item.name}}</option>
                                {% endfor %}
                            </select>
                        </div>
                    </div>

                    <div class="col-xs-2">
                        <div class="form-group">
                            <label for="osConf">操作系统</label>
                            <select class="form-control filter" data-id="osConf"  >
                                <option value="all">全部</option>
                                {% for item in arrOsConf %}
                                    <option value="{{item.osKey}}" {% if query.os==item.osKey %}selected="selected" {% endif %} >{{item.name}}</option>
                                {% endfor %}
                            </select>
                        </div>
                    </div>

                    <div class="col-xs-2">
                        <div class="form-group">
                            <label>起始日期</label>
                            <input type="text" class="form-control filter" data-type="date"  data-id="startDate" placeholder="起始日期" value="{{query.startDate}}">
                        </div>
                    </div>
                        <div class="col-xs-2">
                        <div class="form-group">
                            <label>结束日期</label>
                            <input type="text" class="form-control filter" data-type="date" data-id="endDate" placeholder="结束日期" value="{{query.endDate}}">
                        </div>
                    </div>

                    <div class="col-xs-2">
                        <div class="form-group">
                            <!-- div用来占位 -->
                            <div style="max-width: 100%;margin-bottom: 5px;font-weight: 700;">&nbsp;</div>
                            <button id="btn_query_page" type="button" class="btn btn-default ">查 询</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-body">
                <div id="perf-charts-line" style="width:100%;height:600px;"></div>
            </div>
        </div>



      </div>
      {{ temp.perfPublicJs() }}

    <script>
    ;(function(){
         $('#btn_query_page').on('click',function(e){
            var params = []
            var pKey = $('select[data-id="pageConf"]').val()
            pKey && (params.push('pKey=' + pKey))

            var channel = $('select[data-id="channelConf"]').val()
            channel && (params.push('channel=' + channel))

            var os = $('select[data-id="osConf"]').val()
            os && (params.push('os=' + os))

            var startDate = $('input[data-id="startDate"]').val()
            startDate && (params.push('startDate=' + startDate))

            var endDate = $('input[data-id="endDate"]').val()
            endDate && (params.push('endDate=' + endDate))

            location.href = '/perf/page_by_date/?' + params.join('&')
        })


        try{
            var pKey = '{{pKey}}'
            if(!pKey){
                return
            }
            var pAttr = '{{attr }}'
            var data = {{forTpl |dump |safe}}
            var arrAttrKey = data['arrAttrKey']
            var charts = {
                unit: 'ms',
                legend: data['legend'],
                lineX: data['arrDate'],
                value: data['arrList']

            }
            var echartsIns = echarts.init(document.getElementById('perf-charts-line'))
            var pName = $('select[data-id="pageConf"] option:selected').text()
            drawLine(echartsIns,charts, pName + '-全部性能指标' + '-中位数曲线')

            var legendLen = charts.legend.length
            var charNamesHide = charts.legend.slice(legendLen / 2, legendLen)
            hidechartsLine(echartsIns,charNamesHide)

            echartsIns.on('click', function (args) {
                // 点击时展示当日该指标的柱状图
                console.log(args)
                if(args['componentType'] !== 'series') {
                    return
                }
                var params = []
                var pKey = $('select[data-id="pageConf"]').val()
                pKey && (params.push('pKey=' + pKey))

                var channel = $('select[data-id="channelConf"]').val()
                channel && (params.push('channel=' + channel))

                var os = $('select[data-id="osConf"]').val()
                os && (params.push('os=' + os))

                var date = args['name']
                params.push('date=' + date)

                var sIndex = args['seriesIndex']
                var attrKey = arrAttrKey[sIndex].slice(0, -4)
                params.push('attr=' + attrKey)

                location.href = '/perf/get_attr_col?' + params.join('&')
            })

        }catch(err){
            console.error(err)
        }

    })()
    </script>
</body>
</html>
