{% import "temp.html" as temp %}
<!DOCTYPE html>
<html lang="en">
<head>
    {{ temp.head('平台前端数据聚合') }}
    <style>
        .box{
            width: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%)
        }
        .thumbnail{
            text-decoration: none !important;
            cursor: pointer;
            opacity: .8;
            transition: all .35s;
        }
        .thumbnail:hover{
            opacity: 1;
            transform: translateY(-20px);
        }
        .thumbnail img{
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="box row">
        <div class="col-xs-3">
            <a class="thumbnail" href="/sentry">
                <img src="/public/images/img1.jpg" alt="Sentry Issues">
                <div class="caption">
                    <h3>Sentry Issues</h3>
                    <p>平台前端错误监控数据聚合</p>
                </div>
            </a>
        </div>
        <div class="col-xs-3">
            <a class="thumbnail" href="/perf?pKey=catg">
                <img src="/public/images/img2.jpg" alt="Perf">
                <div class="caption">
                    <h3>Perf</h3>
                    <p>平台前端性能监控聚合</p>
                </div>
            </a>
        </div>
        <div class="col-xs-3">
            <a class="thumbnail" href="/airtest?client=app">
                <img src="/public/images/img3.jpg" alt="airtest">
                <div class="caption">
                    <h3>airtest</h3>
                    <p>平台自动化测试监控系统</p>
                </div>
            </a>
        </div>
        <div class="col-xs-3">
            <a class="thumbnail" href="/trade_monitor">
                <img src="/public/images/img4.jpg" alt="Trade Monitor">
                <div class="caption">
                    <h3>Trade Monitor</h3>
                    <p>交易关键节点监控</p>
                </div>
            </a>
        </div>
    </div>
    {{ temp.publicJs() }}
</body>
</html>
