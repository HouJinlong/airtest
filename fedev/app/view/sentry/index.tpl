{% import "temp.html" as temp %}
<!DOCTYPE html>
<html lang="en">
<head>
    {% if query.project %}
        {{ temp.head((projects[query.project].name or projects[query.project].sentryName)+'错误监控数据聚合') }}
    {% else  %}
       {{ temp.head('平台前端错误监控数据聚合') }}
    {% endif %}
     <style>
        .table th{
            background: rgb(240, 240, 240);
        }
        .table td:nth-of-type(2){
            white-space: nowrap;
        }
        .table td:nth-of-type(4),.table td:nth-of-type(5){
            text-align: center;
        }
        .ignore{
            opacity: .3;
        }
    </style>
</head>
<body>
      {{ temp.header() }}
      <div class="container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    筛选
                    <button class="btn btn-primary btn-xs pull-right" id="pullIssues" style="margin: -3px 0 0; 10px">拉取
                    {% if query.project %}
                        {{projects[query.project].name or projects[query.project].sentryName}}
                    {% else  %}
                        全部项目
                    {% endif %}
                    最新错误</button>
                    <a href="/sentry" class="btn btn-primary btn-xs pull-right" style="margin: -3px 10px 0;">重置</a>
                </div>
                <div class="panel-body">
                    <div class="row p10" >
                        <div class="col-xs-2">
                            <div class="form-group">
                                <label for="people">
                                    项目
                                </label>
                                <select class="form-control filter" data-type="project" >
                                    <option value="">全部</option>
                                    {% for ingredient, amount in projects %}
                                        {% if query.project==ingredient %}
                                            <option value="{{ingredient}}" selected="selected">{{amount.name or amount.sentryName}}</option>
                                        {% else  %}
                                            <option value="{{ingredient}}">{{amount.name or amount.sentryName}}</option>
                                        {% endif %}
                                    {% endfor %}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-1">
                            <div class="form-group">
                                <label for="people">负责人</label>
                                <select class="form-control filter" data-type="people"  >
                                    <option value="">全部</option>
                                    {% for item in people %}
                                        {% if query.people==item %}
                                            <option value="{{item}}" selected="selected">{{item}}</option>
                                        {% else  %}
                                            <option value="{{item}}" >{{item}}</option>
                                        {% endif %}
                                    {% endfor %}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-1">
                            <div class="form-group">
                                <label for="people">进度</label>
                                <select class="form-control filter" data-type="status"  >
                                    <option value="">全部</option>
                                    {% for item in status %}
                                        {% if loop.index!=4 %}
                                            {% if query.status==loop.index %}
                                                <option value="{{loop.index}}" selected="selected">{{item}}</option>
                                            {% else %}
                                                <option value="{{loop.index}}">{{item}}</option>
                                            {% endif %}
                                        {% endif %}
                                    {% endfor %}
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-2">
                            <div class="form-group">
                                <label>首次出现</label>
                                <input type="text" class="form-control filter" data-type="firstSeen" placeholder="只看该时间之后的" value="{{query.firstSeen}}">
                            </div>
                        </div>
                         <div class="col-xs-2">
                            <div class="form-group">
                                <label>最后出现</label>
                                <input type="text" class="form-control filter" data-type="lastSeen" placeholder="只看该时间之后的" value="{{query.lastSeen}}">
                            </div>
                        </div>
                        <div class="col-xs-2">
                            <div class="form-group">
                                <label>count大于等于</label>
                                <input type="text" class="form-control filter" data-type="count" placeholder="例如：10" value="{{query.count}}">
                            </div>
                        </div>
                        <div class="col-xs-2">
                            <div class="form-group">
                                <label>userCount大于等于</label>
                                <input type="text" class="form-control filter" data-type="userCount" placeholder="例如：10" value="{{query.userCount}}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="panel panel-info">
                <div class="panel-body">
                    <table></table>
                </div>
            </div>
      </div>
      <!-- 编辑 -->
      <div class="modal fade" tabindex="-1" role="dialog" id="edit">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">修改</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="people">负责人(必选)</label>
                        <select class="form-control" id="people" >
                            <option value="">未分配</option>
                            {% for item in people %}
                                <option value="{{item}}" >{{item}}</option>
                            {% endfor %}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="status">状态</label>
                        <select class="form-control" id="status" >
                            {% for item in status %}
                                <option value="{{loop.index}}">{{item}}</option>
                            {% endfor %}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="status">UA过滤</label>
                        <input type="text"  class="form-control" id="ua">
                        <p class="help-block">多个用英文'|' 隔开:xxx1|xxx2|xxx3</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary"  id="save" >确认</button>
                </div>
                </div>
            </div>
      </div>
      {{ temp.publicJs() }}
      {{ temp.msg() }}
      <script src="https://cdn.bootcss.com/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"></script>
      <script src="https://cdn.bootcss.com/bootstrap-datepicker/1.9.0/locales/bootstrap-datepicker.zh-CN.min.js"></script>
      <script>
             // 注入数据
        var issuesList = {{issuesList | dump | safe  }};
        var people = {{people | dump | safe  }};
        var projects = {{projects | dump | safe  }};
        $('[data-type="firstSeen"]').datepicker({
            language:"zh-CN",
            todayHighlight:true,
            format: 'yyyy-mm-dd'
        });
        $('[data-type="lastSeen"]').datepicker({
            language:"zh-CN",
            todayHighlight:true,
            format: 'yyyy-mm-dd'
        });
        // 展示修改层
        var $edit = $('#edit');
        function showModal(row){
            $edit.attr('data-id',row.id);
            $('#people',$edit).val(row.people||'').trigger('change');
            $('#status',$edit).val(row.status);
            $('#ua',$edit).val(row.ua);
            $edit.modal('show');
            return $edit;
        }
        $('#people',$edit).change(function(){
            let val = !$(this).val();
            $('#status',$edit).attr('disabled',val)
            $('#ua',$edit).attr('disabled',val)
        });
        $('#save').click(function(){
            var $edit = $('#edit');
            var id = $edit.attr('data-id');
            var people = $('#people',$edit).val();
            if(!people){
                $('#people',$edit).focus();
                return;
            }
            var status = $('#status',$edit).val()*1;
            var ua = $('#ua',$edit).val();
            var _self = this;
            $(_self).attr('disabled',true)
            if(status===4){
                $.get('/api/removeIssues',{
                    id
                },function(res){
                    $(_self).attr('disabled',false)
                    $edit.modal('hide');
                    if(res.code==0){
                        $('table').bootstrapTable('removeByUniqueId', id);
                    }else{
                        showMsg(res.msg)
                    }
                })
            }else{
                $.get('/api/updateIssues',{
                    id,
                    people,
                    status,
                    ua
                },function(res){
                    $(_self).attr('disabled',false)
                    $edit.modal('hide');
                    if(res.code==0){
                        $('table').bootstrapTable('updateByUniqueId', {
                            id,
                            row:res.data
                        });
                    }else{
                        showMsg(res.msg)
                    }

                })
            }

        });
        $('#pullIssues').click(function(){
            var _self = this;
             $(_self).html('拉取中...').attr('disabled',true)
             $.get('/api/pullIssues',{
                project:"{{query.project}}"
            },function(res){
                $(_self).attr('disabled',false)
                if(res.code==0){
                    location.reload();
                }else{
                    showMsg(res.msg)
                }
            })
        });
        function cellStyle(value, row, index) {
            return {
                classes:(row.count == 0)?'ignore':''
            }
        }
        // 表格
        $('table').bootstrapTable({
            data:issuesList,
            striped: true,
            pagination: true,
            pageSize: 10,
            sidePagination: "client",
            pageList: [10, 50, 100, 150],
            uniqueId:'id',
            sortable: true,
            sortOrder: "desc",
            sortName: 'count',
            columns:[
                {
                    field: 'title',
                    title: 'title',
                    formatter:function(value, row, index){
                        return '<a href="'+row.url+'" target="_blank">'+row.id+' : '+value+'</a>';
                    },
                    cellStyle:cellStyle,
                },
                {
                    field: 'schedule',
                    title: '负责人 / 进度',
                    formatter:function(value, row, index){
                        var html ='';
                        if(row.people){
                            html+='<a href="javascript:;" class="people">'+row.people+'</a>';
                        }else{
                            html+='<span class="text-muted">未分配</span>';
                        }
                        html +=' / ';

                        var status = {{status | dump | safe  }};
                        var className = ['muted','primary','success'];
                        html+='<span class="text-'+className[(row.status-1)]+'">'+status[(row.status-1)]+'</span>';
                        return html;
                    },
                    events:{
                        'click .people': function (e, value, row, index) {
                            location.href = setUrlParam('people', row.people)
                        },
                    },
                    cellStyle:cellStyle,
                },
                {
                    field: 'project',
                    title: '项目名称',
                    formatter:function(value, row, index){
                        return '<a href="javascript:;" >'+ (projects[value].name ||projects[value].sentryName) +'</a>';
                    },
                    events:{
                        'click a': function (e, value, row, index) {
                            location.href = setUrlParam('project', value)
                        },
                    },
                    cellStyle:cellStyle,
                },
                {
                    field: 'firstSeen',
                    title: '首次出现',
                    sortable: true,
                    sortName: 'firstSeen',
                    cellStyle:cellStyle,
                },
                {
                    field: 'lastSeen',
                    title: '最后出现',
                    sortable: true,
                    sortName: 'lastSeen',
                    cellStyle:cellStyle,
                },
                {
                    field: 'count',
                    title: 'count',
                    sortable: true,
                    sortName: 'count',
                    cellStyle:cellStyle,
                },
                {
                    field: 'userCount',
                    title: 'user',
                    sortable: true,
                    sortName: 'userCount',
                    cellStyle:cellStyle,
                },
                {
                    field: '操作',
                    title: '操作',
                    cellStyle:cellStyle,
                    formatter:function(value, row, index){
                        return '<button class="btn btn-default edit">编辑</button>';
                    },
                    events:{
                        'click .edit': function (e, value, row, index) {
                            showModal(row)
                        },
                    }
                },
            ]
        });
        $('.filter').change(function(){
            var type = $(this).attr('data-type');
            location.href = setUrlParam(type, $(this).val())
        })
      </script>
</body>
</html>
