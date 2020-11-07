import os
import sys
# 根据当前文件路径 定位 项目根目录
BASEPATH = os.path.join(os.path.split(os.path.realpath(__file__))[0], '../')
# 日志根目录
LOG_ROOT = os.path.join(BASEPATH, 'logs_root')
# 脚本根目录
AIR_ROOT = os.path.join(BASEPATH, 'airs_root')
ADB_PORT = ':5555'
# 截图目录名称
SNAPSHOT_DIR = "snapshot"
# 运行日志目录名称
LOG_DIR = "log"
# 报告目录名称
REPORT_DIR = "report"
# 接口配置
API_ENV = {
    'dev':{
        # api接口配置
        'base_api':'',
        'static_root':'',
    },
    'test':{
        # api接口配置
        'base_api':'http://localhost:17001',
        'static_root':'http://localhost:17001/public/airtest',
    },
    'prod':{
        'base_api':'http://fedev.djtest.cn:17001',
        'static_root':'http://fedev.djtest.cn:17001/public/airtest'
    }
}['test']
