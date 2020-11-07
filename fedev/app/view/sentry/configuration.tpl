{% import "temp.html" as temp %}
<!DOCTYPE html>
<html lang="en">
<head>
     {{ temp.head('配置') }}
     <style>
         .alert-success{
            padding: 3px 30px 3px 5px;
            margin-bottom: 5px;
         }
         .panel-body{
               max-height: calc(100vh - 215px);
                overflow-y: scroll;
         }
     </style>
</head>
<body>
      {{ temp.header('Sentry Issues') }}
      <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <div class="alert alert-warning alert-dismissible" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <strong>提示!</strong>
                        更改配置后后别忘记，点击【拉取最新错误】
                    </div>
                </div>
                <div class="col-xs-6">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                过滤规则
                                <button type="button" class="btn btn-primary btn-xs pull-right"  style="margin-top: -3px"  id="addFilter" >添加</button>
                            </div>
                            <div class="panel-body">
                                {% if data.filter.length %}
                                     <div class="row">
                                        {% for item in data.filter %}
                                            <div class="col-xs-12">
                                                <div class="alert alert-success alert-dismissible ellipsis" role="alert">
                                                    <button type="button" class="close removeBtn" data-key="filter" data-value="{{item}}"><span aria-hidden="true">&times;</span></button>
                                                    {{filterConfig[item.split('——')[0]]['text']}}:
                                                    {{item.split('——')[1]}}
                                                </div>
                                            </div>
                                        {% endfor %}
                                    </div>
                                {% else %}
                                <p class="text-center">暂无</p>
                                {% endif %}
                            </div>
                        </div>
                </div>
                <div class="col-xs-6">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                人员
                                <button type="button" class="btn btn-primary btn-xs pull-right" style="margin-top: -3px"   id="addPeople" >添加</button>
                            </div>
                            <div class="panel-body">
                                  {% if data.people.length %}
                                    <div class="row">
                                        {% for item in data.people %}
                                            <div class="col-xs-6">
                                                    <div class="alert alert-success alert-dismissible ellipsis" role="alert">
                                                        <button type="button" class="close removeBtn" data-key="people" data-value="{{item}}" ><span aria-hidden="true">&times;</span></button>
                                                        {{item}}
                                                    </div>
                                            </div>
                                        {% endfor %}
                                    </div>
                                  {% else %}
                                    <p class="text-center">暂无</p>
                                  {% endif %}
                            </div>
                        </div>
                </div>
            </div>
      </div>

      <div class="modal fade" tabindex="-1" role="dialog" id="add">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title"></h4>
                </div>
                <div class="modal-body">
                    <div class="form-group nameBox" style="display: none">
                        <label for="name" style="display: block">
                            名称
                        </label>
                        <div class="input-group" style="width: 100%;">
                            <input type="text" class="form-control" id="name" placeholder="名称">
                        </div>
                    </div>
                    <div class="row filterBox" style="display: none">
                        <div class="col-xs-8">
                            <div class="form-group">
                                <label for="filter" style="display: block">
                                    过滤规则
                                    <small class="pull-right"><a href="https://tool.oschina.net/regex/" target="_blank">在线正则测试</a></small>
                                </label>
                                <div class="input-group" style="width: 100%;">
                                    <input type="text" class="form-control" id="filter" placeholder="过滤规则">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-4">
                                <div class="form-group">
                                    <label for="name">规则类型</label>
                                    <select  class="form-control" id="filterType">
                                        {% for ingredient, amount in filterConfig %}
                                            <option value="{{ingredient}}">{{amount.text}}</option>
                                        {% endfor %}
                                    </select>
                                </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary"  id="save" >确认</button>
                </div>
                </div>
            </div>
      </div>
      {{ temp.msg() }}
      {{ temp.publicJs() }}
      <script>
             // 注入数据
        var data = {{data | dump | safe  }};

        $('#addFilter').click(function(){
            showModal(true)
        });
        $('#addPeople').click(function(){
            showModal(false)
        });
        $('.removeBtn').click(function(){
            var _self = this;
            $(_self).attr('disabled',true)
            $.get('/api/removeConfig',{
                key:$(_self).attr('data-key'),
                value:$(_self).attr('data-value'),
            },function(res){
                $(_self).attr('disabled',false)
                if(res.code==0){
                    location.reload();
                }else{
                    showMsg(res.msg)
                }
            })
        })
        $('#save').click(function(){

            let $modal = $('#add')
            var key = $modal.attr('data-key');
            var postData = {
                key:key,
            };
            if(key==='filter'){
                postData.value = $('#filter').val().trim();
                postData.type = $('#filterType').val();
            }else{
                postData.value= $('#name').val().trim();
            }
            var _self = this;
            if(postData.value.length){
                $(_self).attr('disabled',true)
                $.get('/api/addConfig',postData,function(res){
                    $(_self).attr('disabled',false)
                    $modal.modal('hide');
                    if(res.code==0){
                        location.reload();
                    }else{
                        showMsg(res.msg)
                    }
                })
            }else{
                if(key==='filter'){
                    $('#filter').focus();
                }else{
                    $('#name').focus();
                }

            }
        })
        //展示添加或修改层
        function showModal(bool){
            let $modal = $('#add')
            if(bool){
                $modal.attr('data-key','filter');
                $('.modal-title',$modal).html('添加过滤规则')
                $('.filterBox',$modal).show().siblings().hide();
            }else{
                $modal.attr('data-key','people');
                $('.modal-title',$modal).html('添加人员')
                $('.nameBox',$modal).show().siblings().hide();
            }
            $modal.modal('show');
        }


      </script>
</body>
</html>
