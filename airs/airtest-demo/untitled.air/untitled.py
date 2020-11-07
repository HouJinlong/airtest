
__author__ = "侯晋龙"
__title__  = "直约业务下单全流程"
import os

#引入 airtest初始化
from airtest.core.api import *
# 引入 poco初始化
from poco.drivers.android.uiautomation import AndroidUiautomationPoco
poco = AndroidUiautomationPoco()
poco.device.wake()
# 引入公共方法
using(os.path.join(os.path.split(os.path.realpath(__file__))[0],'../../common.air'))
import common
weappTools = common.WeappTools(poco,__snapshot_dir__,"58到家家庭服务","online")
#------------------------以上是公共代码，测试准备工作----------------------------------