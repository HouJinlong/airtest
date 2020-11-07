{% import "temp.html" as temp %}
<!DOCTYPE html>
<html lang="en">
<head>
        {{ temp.head('Sentry Issues') }}
        <style>
            .panel{
                cursor: pointer;
            }
            .panel:hover{
                background: #eee;
            }
            h4{
                margin-bottom: 10px;
                margin-top: 0;
            }
            p{
                margin-bottom: 5px;
            }
            #btnAddProject .panel-body{
                height: 159px;
                line-height: 129px;
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
                        添加完项目后别忘记，点击【拉取最新错误】
                    </div>
                </div>
                <div class="col-xs-3" style="height: 100%">
                    <div class="panel panel-default" id="btnAddProject">
                        <div class="panel-body text-center">
                            添加项目
                        </div>
                    </div>
                </div>
                {% for item in projects %}
                    <div class="col-xs-3 project" data-index="{{loop.index0}}">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                    <p>
                                        <div class="row">
                                            <div class="col-xs-8">
                                                <h4 class="ellipsis"><a href="/sentry?project={{item.sentryName}}">{{item.name or item.sentryName}}</a></h4>
                                            </div>
                                            <div class="col-xs-4 text-right">
                                                <button class="btn btn btn-xs btn-default edit">编辑</button>
                                            </div>
                                        </div>
                                        <p>最后更新于：{{item.updateTime or "暂未更新"}}</p>

                                        <p class="ellipsis">文档地址:
                                            {% if item.docUrl %}
                                                <a href="{{item.docUrl}}" target="_blank">{{item.docUrl}}</a>
                                            {% else %}
                                                暂无文档
                                            {% endif %}
                                        </p>

                                        <p class="ellipsis">负责人:
                                                {% if item.people %}
                                                     {{item.people}}
                                                {% else %}
                                                    暂无负责人
                                                {% endif %}
                                        </p>
                                        <p class="ellipsis">邮箱:
                                            {% if item.email %}
                                                {{item.email}}
                                            {% else %}
                                                暂无邮箱
                                            {% endif %}
                                        </p>
                                    </p>
                            </div>
                        </div>

                    </div>
                {% endfor %}

            </div>
        </div>

        <!-- 添加或修改项目 -->
        <div class="modal fade" tabindex="-1" role="dialog" id="addProject">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">添加项目</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="sentryName">项目名称(必填)</label>
                        <div class="input-group" style="width: 100%;">
                            <input type="text" class="form-control" id="sentryName" placeholder="请输入sentry项目名称">
                            <span class="input-group-btn" style="display: none">
                                &nbsp;
                                <button class="btn btn-danger" type="button" id="removeProject">删除</button>
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="name">展示项目名称</label>
                        <input type="text" class="form-control" id="name" placeholder="请输入展示项目名称">
                    </div>
                    <div class="form-group">
                        <label for="docUrl">文档地址</label>
                        <input type="text" class="form-control" id="docUrl" placeholder="请输入项目修改文档地址">
                    </div>
                    <div class="form-group">
                        <label for="people">项目负责人</label>
                        <input type="text" class="form-control" id="people" placeholder="请输入项目负责人">
                    </div>
                    <div class="form-group">
                        <label for="email">接收通知的邮箱</label>
                        <input type="text" class="form-control" id="email" placeholder="请输入邮箱地址">
                        <p class="help-block">添加或修改邮箱会发送测试邮件</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary"  id="saveProject" >确认</button>
                </div>
                </div>
            </div>
      </div>
      {{ temp.msg() }}
      {{ temp.publicJs() }}
      <script>
        var projects = {{projects | dump | safe}}

        // 展示添加弹层
        $('#btnAddProject').click(function(){
            showModal();
        });
        // 添加项目
        $('#saveProject').click(function(){
            let $modal = $('#addProject')

            var sentryName = $('#sentryName').val().trim();
            var name = $('#name').val().trim();
            var docUrl = $('#docUrl').val().trim();
            var people = $('#people').val().trim();
            var email = $('#email').val().trim();
            var _self = this;
            if(sentryName.length){
                $(_self).attr('disabled',true)
                $.get('/api/addProject',{
                    sentryName,
                    name,
                    docUrl,
                    people,
                    email
                },function(res){
                    $(_self).attr('disabled',false)
                    $modal.modal('hide');
                    if(res.code==0){
                        location.reload();
                    }else{
                        showMsg(res.msg)
                    }
                })
            }else{
                $('#sentryName').focus();
            }
        })
        // 修改
        $('.edit').click(function(){
            var index = $(this).parents('.project').attr('data-index');
            showModal(projects[index])
        })
        //展示添加或修改层
        function showModal(obj){
            let $modal = $('#addProject')
            if(obj){
                $('.modal-title',$modal).html('修改sentry项目信息')
                $('#removeProject',$modal).parent().show();
                $('#sentryName',$modal).val(obj.sentryName).attr('disabled',true);
                $('#name',$modal).val(obj.name);
                $('#docUrl',$modal).val(obj.docUrl);
                $('#people',$modal).val(obj.people);
                $('#email',$modal).val(obj.email);
            }else{
                $modal.attr('data-oldname','');
                $('.modal-title',$modal).html('添加sentry项目信息')
                $('#removeProject',$modal).parent().hide();
                $('input',$modal).val('').attr('disabled',false);
            }
            $modal.modal('show');
        }
        $('#removeProject').click(function(){
            var _self = this;
            let $modal = $('#addProject')
            $(_self).attr('disabled',true)
            var sentryName = $('#sentryName').val().trim();
            $.get('/api/removeProject',{
                sentryName
            },function(res){
                $(_self).attr('disabled',false)
                $modal.modal('hide');
                if(res.code==0){
                    location.reload();
                }else{
                    showMsg(res.msg)
                }
            })
        })

      </script>
</body>
</html>
