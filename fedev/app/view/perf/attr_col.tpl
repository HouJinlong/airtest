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
                                <option value=""></option>
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

                    <div class="col-xs-1">
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

                     <div class="col-xs-3">
                        <div class="form-group">
                            <label>性能指标</label>
                            <select class="form-control filter" data-id="attrConf"  >
                                {% for item in arrAttrConf %}
                                    <option value="{{item.aKey}}" {% if query.attr==item.aKey %}selected="selected" {% endif %} >{{item.name}}</option>
                                {% endfor %}
                            </select>
                        </div>
                    </div>

                    <div class="col-xs-2">
                        <div class="form-group">
                            <label>日期</label>
                            <input type="text" class="form-control filter" data-type="date" data-id="date" placeholder="日期" value="{{query.date}}">
                        </div>
                    </div>

                    <div class="col-xs-2">
                        <div class="form-group">
                            <!-- div用来占位 -->
                            <div style="max-width: 100%;margin-bottom: 5px;font-weight: 700;">&nbsp;</div>
                            <button id="btn_attr_col" type="button" class="btn btn-default ">查 询</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-body">
                <div id="perf-charts-col" style="width:100%;height:600px;"></div>
                <table style="margin-top:20px;"  id="logTab"></table>
            </div>
        </div>
    </div>
      {{ temp.perfPublicJs() }}

    <script>
    ;(function(){
        function getCommonParams(){
            var params = []
            var pKey = $('select[data-id="pageConf"]').val()
            pKey && (params.push('pKey=' + pKey))

            var channel = $('select[data-id="channelConf"]').val()
            channel && (params.push('channel=' + channel))

            var os = $('select[data-id="osConf"]').val()
            os && (params.push('os=' + os))

            var attr = $('select[data-id="attrConf"]').val()
            attr && (params.push('attr=' + attr))

            var date = $('input[data-id="date"]').val()
            date && (params.push('date=' + date))

            return params
        }

         $('#btn_attr_col').on('click',function(e){
            var params = getCommonParams()
            location.href = '/perf/get_attr_col?' + params.join('&')
        })
        /*
            params = {
                sortName:''
            }
        */

        function showLogTab(params,showAttr){
            // console.log('showAttr:' + showAttr)

            $('#logTab').bootstrapTable('destroy').bootstrapTable({
                url: '/perf/getLogList?' + params.join('&'),
                responseHandler:function(res){
                    if(res && res['code'] === 0){
                        return res['data']
                    }else{
                        console.error(res['msg'])
                        return {}
                    }
                },
                striped: true,
                height:600,
                virtualScroll:true,
                pagination: true,
                pageSize: 50,
                sidePagination: "server",
                pageList: [50, 100, 150, 200],
                uniqueId:'_id',
                sortable: true,
                sortOrder: "asc",
                sortName: showAttr,
                showColumns:true,
                showRefresh:true,
                showToggle:true,
                showFullscreen:true,
                columns:[
                    {
                        field: 'pageWebkitPrepareTime',
                        title: 'pageWebkitPrepareTime',
                        sortable: showAttr === 'pageWebkitPrepareTime',
                        sortName: 'pageWebkitPrepareTime'
                    },
                    {
                        field: 'pageRequestHtmlTime',
                        title: 'pageRequestHtmlTime',
                        sortable: showAttr === 'pageRequestHtmlTime',
                        sortName: 'pageRequestHtmlTime'
                    },
                    {
                        field: 'pageRequestResourceTime',
                        title: 'pageRequestResourceTime',
                        sortable: showAttr === 'pageRequestResourceTime',
                        sortName: 'pageRequestResourceTime'
                    },
                    {
                        field: 'pageApiTime',
                        title: 'pageApiTime',
                        sortable: showAttr === 'pageApiTime',
                        sortName: 'pageApiTime'
                    },
                    {
                        field: 'pageRenderTime',
                        title: 'pageRenderTime',
                        sortable: showAttr === 'pageRenderTime',
                        sortName: 'pageRenderTime'
                    },
                    {
                        field: 'pageWholeTime',
                        title: 'pageWholeTime',
                        sortable: showAttr === 'pageWholeTime',
                        sortName: 'pageWholeTime'
                    },
                    {
                        field: 'userId',
                        title: 'userId'
                    },
                    {
                        field: 'deviceId',
                        title: 'deviceId'
                    },
                    {
                        field: 'os',
                        title: 'os',
                        sortable: true,
                        sortName: 'os'
                    },

                    {
                        field: 'network',
                        title: 'network',
                        sortable: true,
                        sortName: 'network'
                    },
                    {
                        field: 'lat',
                        title: 'lat'
                    },
                    {
                        field: 'lng',
                        title: 'lng'
                    },
                    {
                        field: 'url',
                        title: 'url',
                        formatter:function(value, row, index){
                            var url = decodeURIComponent(row.url)
                            return '<a href="'+url+'" target="_blank">'+ url + '</a>';
                        }
                    }
                ]
            })
        }

        try{
            var pKey = '{{pKey}}'
            if(!pKey){
                return
            }
            var pAttr = '{{attr }}'
            var data = {{forTpl |dump |safe}}

            var echartsIns = echarts.init(document.getElementById('perf-charts-col'))
            var pName = $('select[data-id="pageConf"] option:selected').text()
            var attrName = $('select[data-id="attrConf"] option:selected').text()
            drawCol(echartsIns, data, pName + '-' + attrName + '-分布柱状图'  )

            var list = data[ 'col' ]
            var maxCol = list.length - 1
            var attrVal = {}

            echartsIns.on('click', function (args) {
                // 点击时展示当日该指标的柱状图
                // console.log(args)
                if(args['componentType'] !== 'series' && args['componentSubType'] !== 'bar') {
                    return
                }
                let dIndex = args['dataIndex']
                attrVal = {}
                if(dIndex >= maxCol){
                    attrVal['gte']  = (dIndex - 1) * 100
                     attrVal['lte']  = '#'
                }else if(dIndex <= 0){
                    attrVal['lte'] = 0
                    attrVal['gte'] = '#'
                }else{
                    attrVal['gte'] = (dIndex -1) * 100
                    attrVal['lte'] = dIndex * 100
                }

                // console.log(attrVal)
                var params = getCommonParams()
                params.push('attrVal=' + encodeURIComponent(attrVal['gte'] + '|' + attrVal['lte']))
                var showAttr = $('select[data-id="attrConf"]').val()
                showLogTab(params, showAttr)
            })

        }catch(err){
            console.error(err)
        }

    })()
    </script>
</body>
</html>
