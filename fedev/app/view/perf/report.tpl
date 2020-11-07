{% import "temp.html" as temp %}
<!DOCTYPE html>
<html lang="en">
<head>
    {{ temp.head('页面性能数据报告') }}
</head>
<body>
    {{ temp.perfHeader() }}
    <div class="container">
        <div class="panel panel-default">
            <div class="panel-body">
                <h3 style="margin:10px auto;width:350px;">最近两周页面加载时间变化趋势</h3>
                <table style="margin-top:20px;"  id="logTab"></table>
            </div>
        </div>
    </div>
      {{ temp.perfPublicJs() }}
    <script>
    ;(function(){
        var data = {{forTpl |dump |safe}}
        var date = data['date']
        function showLogTab(data){
            var $tab = $('#logTab')
            $tab.bootstrapTable('destroy').bootstrapTable({
                data: data['list'],
                classes:'table table-bordered table-hover table-striped',
                align:'center',
                pagination: true,
                pageSize: 100,
                sidePagination: "client",
                pageList: [10,50, 100],
                columns:[
                    {
                        field: 'pageName',
                        title: '页面'
                    },
                    {
                        field: 'channelName',
                        title: '渠道'
                    },
                    {
                        field: 'avgLastWeek',
                        title: '上周加载时间中位数均值['+ date[1]['startDate'] + '-' + date[1]['endDate'] + ']'
                    },
                    {
                        field: 'avgThisWeek',
                        title: '本周加载时间中位数均值[' + date[0]['startDate'] + '-' + date[0]['endDate'] + ']'
                    },
                    {
                        field: '',
                        title: '变化趋势',
                        formatter:function(value, row, index){
                            var desc = '',diff = 0
                            if(row.avgThisWeek && row.avgLastWeek && row.cntLastWeek && row.cntThisWeek){
                                diff = row.avgThisWeek - row.avgLastWeek
                                if(row.cntThisWeek < 100 || row.cntLastWeek < 100){
                                    desc = '上报的数据太少'
                                }
                            }else{
                                desc = '数据不全'
                            }

                            var colorStyle="color: #999;"
                            if(!desc){
                                if(diff > 0){
                                    desc = '↑' + Math.abs(diff)
                                    if(Math.abs(diff)>= 50){
                                        colorStyle="color: #f00;"
                                    }
                                }else {
                                    if(Math.abs(diff)>= 50){
                                        colorStyle="color: #008000;"
                                    }

                                    desc ="↓" + Math.abs(diff)
                                }
                            }

                            return '<span style="' + colorStyle + '" >' + desc + '</span>' 　
                        }
                    }
                ],
                onPageChange:function(){
                    mergeCells();
                }
            })
            function mergeCells(){
                // 合并单元格
                var startIndex = 0
                var tag = data['tag']
                for(var i = 0,len= tag.length; i<len; i++){
                    var rowSpan = tag[i]['channelCnt']
                    $tab.bootstrapTable('mergeCells', {
                        index: startIndex,
                        field: 'pageName',
                        colspan: 1,
                        rowspan: rowSpan
                    })
                    startIndex += rowSpan
                }
            }
            mergeCells();
        }

       showLogTab(data)

    })()
    </script>
</body>
</html>
