from dwebsocket.decorators import accept_websocket
# 启动定时任务
from auto_test_client.task import scheduler
# 渲染模板
from django.shortcuts import render
# 返回json数据
from django.http import HttpResponse

from tools.qrcode import get_qrcode_base64
import tools.adb as tools_adb
import time
import json
def index(request):
    context = {}
    context['qrcode'] = get_qrcode_base64(request.build_absolute_uri()+'connect')
    return render(request, 'index.html', context)

@accept_websocket
def index_ws(request):
    if request.is_websocket():
        while 1:
            time.sleep(5) ## 向前端发送时间
            dit = {
                'time':time.strftime('%Y.%m.%d %H:%M:%S',time.localtime(time.time()))
            }
            request.websocket.send(json.dumps(dit))

def connect(request):
    context = {}
    context['device'] = json.dumps(tools_adb.get_device(request.META['REMOTE_ADDR']) or {})
    return render(request, 'connect.html', context)

def connect_device(request):
    device = tools_adb.connect_device(request.META['REMOTE_ADDR'])
    if(device):
        data = {
            "code":0,
            "data":device
        }
    else:
        data = {
            "code":1,
            "msg":'请检查usb连接'
        }
    return HttpResponse(json.dumps(data,ensure_ascii=False),content_type="application/json,charset=utf-8")

def disconnect_device(request):
    request.encoding='utf-8'
    if 'id' in request.GET and request.GET['id']:
        tools_adb.disconnect_device(
            request.META['REMOTE_ADDR'],
            request.GET['id']
            )
        data = {
            "code":0,
            "msg":'成功'
        }
    else:
        data = {
            "code":1,
            "msg":'缺少参数id'
        }
    return HttpResponse(json.dumps(data,ensure_ascii=False),content_type="application/json,charset=utf-8")