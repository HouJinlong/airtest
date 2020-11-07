import json
import requests
from auto_test_script.tools.config import API_ENV

class Api():
    def __init__(self):
        self.base_api = API_ENV['base_api']

    def get_devices(self,params={"has_ip": 'true'}):
        res=requests.get(self.base_api+'/airtest/devices/get',params=params)
        if(res.status_code==200):
            res = json.loads(res.text)
            if(res['code']==0):
                if(len(res['data'])>0):
                    return res['data']
        return False
    
    def update_devices(self,devices):
        res=requests.post(self.base_api+'/airtest/devices/update',data={
            'data':json.dumps(devices)
        })
        if(res.status_code==200):
            res = json.loads(res.text)
            if(res['code']==0):
                return True
        return False
    def update_git(self,data):
        res=requests.post(self.base_api+'/airtest/gits/update',data=data)
        if(res.status_code==200):
            res = json.loads(res.text)
            if(res['code']==0):
                print(res)

    # 获取需要运行的测试任务记录
    def get_task(self,params=None):
        res=requests.get(self.base_api+'/airtest/tasks/get',params=params)
        if(res.status_code==200):
            res = json.loads(res.text)
            if(res['code'] == 0):
                return res['data']
        return False
    # 上传测试结果
    def update_task(self,data,files=None):
        res=requests.post(self.base_api+'/airtest/tasks/update',data=data,files=files)
        if(res.status_code==200):
            res = json.loads(res.text)
            if(res['code'] == 0):
                return True
        return False   

server_api = Api()
