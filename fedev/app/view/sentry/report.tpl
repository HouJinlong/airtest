{% import "temp.html" as temp %}
<!DOCTYPE html>
<html lang="en">
<head>
    {{ temp.head('页面性能数据报告') }}
    <style>
        .ignore{
            opacity: .6;
        }
    </style>
</head>
<body>
    {{ temp.header() }}
    <div class="container">
        <div class="panel panel-default">
            <div class="panel-body">
                <h3 style="margin:10px auto;width:350px;">最近一周项目错误变化趋势</h3>
                <table style="margin-top:20px;"  id="logTab"></table>
            </div>
        </div>
    </div>
    {{ temp.publicJs() }}
    <script>
        $(function(){
            var pageData = {{data | dump | safe  }};
            var projects = {{projects | dump | safe  }};
            console.log({pageData,projects})
            var data = pageData.data;
            var time = pageData.time;
            if(data.todayData&&data.todayData.length){
                var tableData = {};
                var toDayAllCount = 0;
                var oldDayAllCount = 0;
                data.todayData.forEach(v=>{
                    toDayAllCount+=v.count;
                    tableData[v._id] = {
                        toDayCount:v.count
                    };
                })
                if(data.olddayData&&data.olddayData.length){
                    data.olddayData.forEach(v=>{
                        if(!tableData[v._id]){
                            tableData[v._id] = {};
                        }
                        oldDayAllCount += v.count;
                        tableData[v._id]['oldDayCount']  = v.count;
                    })
                }
                var tableDataArr = [];
                Object.keys(projects).forEach(x=>{
                    if(!tableData[x]){
                        tableData[x] = {
                            oldDayCount:0,
                            toDayCount:0
                        }
                    }
                    tableDataArr.push({
                        project:x,
                        oldDayCount:tableData[x].oldDayCount || 0,
                        toDayCount:tableData[x].toDayCount || 0,
                    })
                })
                showLogTab(tableDataArr,toDayAllCount,oldDayAllCount);
            }
            function cellStyle(value, row, index) {
                return {
                    classes:(row.toDayCount == 0)?'ignore':''
                }
            }
            function showLogTab(data){
                var $tab = $('#logTab')
                $tab.bootstrapTable('destroy').bootstrapTable({
                    data:data,
                    classes:'table table-bordered table-hover table-striped',
                    align:'center',
                    sortable: true,
                    sortOrder: "desc",
                    sortName: 'toDayCount',
                    columns:[
                        {
                            field: 'project',
                            title: '项目',
                            formatter:function(value, row, index){
                                return '<a href="/sentry?project='+projects[value].sentryName+'" >'+ (projects[value].name ||projects[value].sentryName) +'</a>';
                            },
                            cellStyle:cellStyle,
                        },
                        {
                            field: 'oldDayCount',
                            title: '一周前错误数['+time.oldday+']'+oldDayAllCount+'个',
                            cellStyle:cellStyle,
                        },
                        {
                            field: 'toDayCount',
                            title: '当前的错误数['+ time.today + ']'+toDayAllCount +'个',
                            cellStyle:cellStyle,
                        },
                        {
                            field: '',
                            title: '变化趋势',
                            cellStyle:cellStyle,
                            formatter:function(value, row, index){
                                var desc = '',diff = 0
                                if(row.oldDayCount != row.toDayCount ){
                                    diff = row.toDayCount - row.oldDayCount;
                                }else{
                                    desc = '无变化';
                                }
                                var colorStyle="color: #999;"
                                if(!desc){
                                    if(diff > 0){
                                        desc = '↑' + Math.abs(diff)
                                        colorStyle="color: #f00;"
                                    }else {
                                        colorStyle="color: #008000;"
                                        desc ="↓" + Math.abs(diff)
                                    }
                                }
                                return '<span style="' + colorStyle + '" >' + desc + '</span>' 　
                            }
                        }
                    ]
                })
            }
        })


    </script>
</body>
</html>
