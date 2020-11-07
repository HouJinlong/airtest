# -*- encoding=utf8 -*-
import os
import sys
BASEPAH = os.path.split(os.path.realpath(__file__))[0]
sys.path.append(os.path.join(BASEPAH, '../'))

import  threading,json,shutil

from auto_test_script.tools.common import validate_dirname
from auto_test_script.tools.config import BASEPATH,ADB_PORT,LOG_ROOT
from auto_test_script.tools.api import server_api
from auto_test_script.tools.adb import get_on_devices,get_off_devices,get_device
from auto_test_script.tools.airs import init_air

class Poll:
    def __init__(self):
        self.poll_key = 'id'
        #线程池
        self.poll = {
            #'serialno':Thread
        }
    def add(self,device):
        pool_key = device[self.poll_key]
        try:
            self.poll[pool_key]
        except:
            self.poll[pool_key] = threading.Thread(target=run_device, args=(device,))
            self.poll[pool_key].start()
    def remove(self,device):
        pool_key = device[self.poll_key]
        del self.poll[pool_key]
# 线程池 对象
devices_poll = Poll()

def run_air(script,ip):
    print('BASEPAH',BASEPAH)
    device = 'Android:///'+ip+ADB_PORT
    log_root= os.path.join(LOG_ROOT,validate_dirname(device))
    try:
        print('脚本命令:','python3 '+BASEPAH+'/custom_launcher.py '+script +' --device '+device)
        os.system('python3 '+BASEPAH+'/custom_launcher.py '+script +' --device '+device)
    except:
        pass
    datafile = os.path.join(log_root,'data.txt')
    f = open(datafile,encoding="utf-8")
    str = f.read()
    f.close()
    os.remove(datafile)
    data = json.loads(str)
    shutil.rmtree(data['log'])
    # 获取报告zip
    shutil.make_archive(data['log_root'],'zip',data['log_root'])
    data['zipPath'] = data['log_root']+'.zip'
    return data

def run_device(device):
    global devices_poll
    try:
        if(device['ip']==''):
            # 断开
            server_api.update_devices({
                "id":device['id'],
                "ip":''
            })
        else:
            data = server_api.get_task({
                "device_id":device['id']
            })
            print(data)
            if(data):
                ret = init_air(data)
                if(data['git_update']):
                    server_api.update_git({
                        'id':data['git_id'],
                        "version":ret['version']
                    })
                if(server_api.update_task({
                        'id':data['id'],
                        "status":1,
                        'version':ret['version']
                    })):
                    test_ret = run_air(ret['script'],device['ip'])
                    print(test_ret)
                    test_data = {
                        'id':data['id'],
                    }            
                    if(len(test_ret['errText'])==0):
                        # 成功
                        test_data['status']= 2
                    else:
                        # 标记任务状态-失败
                        test_data['status']= 3
                        test_data['msg']= test_ret['errText']
                    server_api.update_task(test_data,{
                        'file':(test_ret['zipPath'],open(test_ret['zipPath'],'rb'),'application/zip')
                    })
                    os.remove(test_ret['zipPath'])

                    # 继续运行
                    run_device(check_device(device))
    finally:
        # 运行完成删除 该 线程
        devices_poll.remove(device)

def check_device(device):
    on_devices = get_on_devices()
    print('devices',on_devices)
    try:
        on_devices.index(device['ip']+ADB_PORT)
        print('在线')
    except :
        device['ip'] = ''
        print('不在线')
    return device
def main():
    print('...主程序开始...')
    devices = server_api.get_devices()
    print('old_devices',devices)
    if(devices):
        for device in devices:
            # 为该设备开启一个 线程
            devices_poll.add(check_device(device))
    print('...主程序结束...')

if __name__ == '__main__':
    main()