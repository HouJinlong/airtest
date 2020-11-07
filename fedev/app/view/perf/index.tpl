{% import "temp.html" as temp %}
<!DOCTYPE html>
<html lang="en">
{{ temp.head('平台前端性能监控聚合') }}
<body>
    {{ temp.perfHeader() }}
    <div class="container">
        <div class="panel panel-default">
            <div class="panel-heading">
                筛选
                <!-- <a href="/perf" class="btn btn-primary btn-xs pull-right" style="margin:0 10px;">回首页</a> -->
            </div>
            <div class="panel-body">
                <div class="row p10" >
                    <div class="col-xs-2">
                        <div class="form-group">
                            <label for="pageConf">
                                页面
                            </label>
                            <select class="form-control filter" data-id="pageConf" >
                                <option value="">请选择页面</option>
                                {% for item in arrPageConf %}
                                    <option value="{{item.pKey}}" {% if query.pKey == item.pKey %}selected="selected" {% endif %} >{{item.name}}</option>
                                {% endfor %}
                            </select>
                        </div>
                    </div>

                    <div class="col-xs-2">
                        <div class="form-group">
                            <label>起始日期</label>
                            <input type="text" class="form-control filter" data-type="date" data-id="startDate" placeholder="起始日期" value="{{query.startDate}}">
                        </div>
                    </div>
                        <div class="col-xs-2">
                        <div class="form-group">
                            <label>结束日期</label>
                            <input type="text" class="form-control filter" data-type="date" data-id="endDate" placeholder="结束日期" value="{{query.endDate}}">
                        </div>
                    </div>

                    <div class="col-xs-4">
                        <div class="form-group">
                            <!-- div用来占位 -->
                            <div style="max-width: 100%;margin-bottom: 5px;font-weight: 700;">&nbsp;</div>
                            <button id="btn_query_channel" type="button" class="btn btn-default ">查 询</button>
                            <button id="btn_query_page" type="button" class="btn btn-default ">查看详细数据</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-body">
                <div id="perf-charts-line" style="width:100%;height:600px;"></div>
                <div id="cnt-charts-line" style="width:100%;height:600px;margin-top:20px;"></div>
            </div>
        </div>
      </div>
      {{ temp.perfPublicJs() }}

    <script>
    ;(function(){
        $('#btn_query_channel').on('click',function(e){
            var pKey = $('select[data-id="pageConf"]').val()
            var startDate = $('input[data-id="startDate"]').val()
            var endDate = $('input[data-id="endDate"]').val()
            location.href = '/perf?pKey=' + pKey + '&startDate=' +　startDate + '&endDate=' + endDate
        })
        $('#btn_query_page').on('click',function(e){
            var pKey = $('select[data-id="pageConf"]').val()
            var startDate = $('input[data-id="startDate"]').val()
            var endDate = $('input[data-id="endDate"]').val()
            location.href = '/perf/page_by_date/?pKey=' + pKey + '&startDate=' +　startDate + '&endDate=' + endDate
        })

        try{
            var pKey = '{{pKey}}'
            if(!pKey){
                return
            }
            var pAttr = '{{attr }}'
            var data = {{forTpl | dump | safe}}
            var charts = {
                unit: 'ms',
                legend: data['legend'],
                lineX: data['arrDate'],
                value: data['arrList']

            }
            var echartsIns = echarts.init(document.getElementById('perf-charts-line'))
            var pName = $('select[data-id="pageConf"] option:selected').text()
            drawLine(echartsIns ,charts, pName + '-页面加载时间中位数曲线')

            var legendHide = ['赶集APP']
            var pKey = $('select[data-id="pageConf"]').val()
            if(pKey !== 'direct'){
                legendHide.push('微信渠道')
            }
            hidechartsLine(echartsIns,legendHide)

            var echartsIns2 = echarts.init(document.getElementById('cnt-charts-line'))
            var charts2 = {
                unit: '个',
                legend: data['legend'],
                lineX: data['arrDate'],
                value: data['arrCntList']
            }
            drawLine(echartsIns2 ,charts2, pName + '-各渠道上报数据量曲线')



        }catch(err){
            console.error(err)
        }

    })()
    </script>
</body>
</html>
