# -*- encoding=utf8 -*-
import os
import sys
sys.path.append(os.path.join(os.path.split(os.path.realpath(__file__))[0], '../'))

import argparse
import shutil
import json
from airtest.cli.runner import run_script,AirtestCase
from airtest.core.settings import Settings as ST
from airtest.core.api import snapshot,connect_device,auto_setup
from airtest.cli.parser import runner_parser

from auto_test_script.tools.common import validate_dirname,init_dir
from auto_test_script.tools.config import LOG_ROOT,LOG_DIR,SNAPSHOT_DIR,API_ENV,REPORT_DIR
# 导入项目中airtest旧的导出模块
import auto_test_script.airtest_report.report as report
    
class CustomAirtestCase(AirtestCase):
    def __init__(self):
        super(CustomAirtestCase, self).__init__()
    def setUp(self):
        # 脚本全局变量
        self.scope["__snapshot_dir__"] = self.args.snapshot
        super(CustomAirtestCase, self).setUp()
    def tearDown(self):
        super(CustomAirtestCase, self).tearDown()

# 解析参数
def parse_args():
    ap = runner_parser()
    args = ap.parse_args()
    return args
class CustomLauncher():
    def __init__(self,args):
        print(args)
        self.script = args.script
        self.device = args.device[0]
        if(args.device):
            connect_device(self.device)

        self.run()
    def run(self):
        # 准备文件夹
        log_root,log,snapshot = self.run_before()
        self.log_root = log_root
        self.log = log
        self.snapshot = snapshot
        args = argparse.Namespace(device=self.device, log=log,snapshot=snapshot,recording=None, script=self.script)
        try:
            print(args)
            run_script(args, CustomAirtestCase)
        except:
            pass
        
        self.run_after(log_root,log)
    def run_before(self):
        log_root= os.path.join(LOG_ROOT,validate_dirname(self.device))
        
        init_dir(log_root,True)
       
        # 创建运行日志目录
        log = os.path.join(log_root,LOG_DIR)
        init_dir(log)
        # 创建截图目录
        snapshot = os.path.join(log_root,SNAPSHOT_DIR)
        init_dir(snapshot)
        return log_root,log,snapshot
    # 简化日志文件
    def simplify_log(self,logfile):
        f = open(logfile)             
        line = f.readline()   
        newTextLines = []     
        while line:   
            lineData = json.loads(line);    
            newTextLines.append(line) 
            # 删除小程序触发重绘的操作
            if(lineData['data']['name']=='touch' and lineData['data']['call_args']['v']== [300,500]):
                del newTextLines[len(newTextLines)-1]
                del newTextLines[len(newTextLines)-1]
                del newTextLines[len(newTextLines)-1]
                line = f.readline()
            # 删除脚本自动无意义的截图
            if(lineData['data']['name']=='snapshot' and (not lineData['data']['call_args']['filename'])):
                del newTextLines[len(newTextLines)-1]
            line = f.readline()   
        f.close()
        file_write_obj = open(logfile, 'w')
        for var in newTextLines:
            file_write_obj.writelines(var)
        file_write_obj.close()
    def run_after(self,log_root,log):
        script = self.script
        errText = ''
        logfile = os.path.join(log,'log.txt')
        if(not os.path.exists(logfile)):
            errText = '检查设备连接'
        else:
            logfileSize = os.path.getsize(logfile)
            if(logfileSize ==0):
                errText = '脚本文件名错误'
            else:
                static_root = API_ENV['static_root']
                print(static_root,static_root)
                # 导出完整报告
                rpt = report.LogToHtml(script,log,static_root=static_root,export_dir=log_root,lang='zh')
                rpt.report("log_template.html")
                log_dir = os.path.join(log_root,REPORT_DIR)
                shutil.move(rpt.script_root,log_dir)     
                # 修改名称 log.html 为 log_all.html
                shutil.move(os.path.join(log_dir,'log.html'),os.path.join(log_dir,'log_all.html'))
                self.simplify_log(logfile)
                # 导出简化报告
                rpt1 = report.LogToHtml(script,log,static_root=static_root,export_dir=log_root,lang='zh')
                rpt1.report("log_template.html")
                shutil.move(os.path.join(rpt1.script_root,'log.html'),os.path.join(log_dir,'log.html'))
                shutil.rmtree(rpt1.script_root)
                if(not rpt.test_result):
                    errText = '脚本运行失败'
        self.errText = errText
        # 写下测试结果
        f = open(os.path.join(log_root,'data.txt'),'w',encoding="utf-8")
        f.write(json.dumps({
            'errText':errText,
            'log_root':log_root,
            'log':log
        }))
        f.close()

if __name__ == '__main__':
    CustomLauncher(parse_args())