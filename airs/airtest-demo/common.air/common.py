# -*- encoding=utf8 -*-
from airtest.core.api import *
import os
import re
# 通用工具       
class Tools:
    def __init__(self,poco,snapshot_dir):
        # 获取设备的屏幕 宽高
        self.device_info = poco.device.get_display_info()
        self.snapshot_dir = snapshot_dir
    def get_snapshot_name(self,filename):
        return os.path.join(self.snapshot_dir,filename)
    # 通过touch方式对poco对象进行点击（这样报告会标记）
    def poco_click(self,poco_obj):
         x,y = poco_obj.get_position()
         touch(v=[(x*self.device_info['width']),(y*self.device_info['height'])])
         
    # 获取目标内的 第一个或者最后一个TextView文字
    # pocoObj 目标
    # Bool True(第一个)/False(最后一个)  默认获取第一个
    # default 若没有文字的默认文字
    def getText(self,pocoObj,Bool=True,default=''):
        try:
            pocoText = pocoObj.offspring(textMatches='.+')
            if(Bool):
                return pocoText[0].attr('text')
            else:
                return pocoText[len(pocoText)-1].attr('text')
        except:  
            return default
            
    # 去除文件名中不能包含的 符号
    def validateTitle(self,title):
        rstr = r"[\/\\\:\*\?\"\<\>\|]"  # '/ \ : * ? " < > |'
        new_title = re.sub(rstr, "_", title)  # 替换为下划线
        return new_title
# 小程序工具    
class WeappTools(Tools):
    def __init__(self,poco,snapshot_dir,testWeapp,testVer="online",test=False):
        super().__init__(poco,snapshot_dir)
        self.poco = poco
        self.testWeapp = testWeapp
        self.testVer = testVer
        #打开微信
        if(not test):
            stop_app("com.tencent.mm")
        start_app("com.tencent.mm")
        if(not test):
            footerTab = poco(text="发现")
            self.waitOpenPage([footerTab],'','微信')
            footerTab.click()
        #     poco(text="小程序").click()
        #     poco(text="我的小程序").click()
        # else:
        #     sleep(2.0)
        # self.openWeapp()
        
    def openWeapp(self):
        poco = self.poco
        weappBoxs = poco("android.support.v7.widget.RecyclerView").children()
        print('weappBoxs',len(weappBoxs))
        for weappBox in weappBoxs:
            TextView = weappBox.offspring(type='android.widget.TextView')
            print('TextView',len(TextView))
            weappText = TextView[0].get_text()
            print(weappText)
            if(weappText==self.testWeapp):
                try:
                    verText = TextView[1].get_text()
                except:
                    verText = "线上版"

                print('正在打开  '+self.testWeapp+'('+verText+')')
                if (self.testVer == 'dev' and verText=='开发版'):
                    weappBox.click()
                    break
                elif (self.testVer == 'sandbox' and verText=='体验版'):
                    weappBox.click()
                    break
                elif(self.testVer == 'online' and verText=='线上版'):
                    weappBox.click()
                    break
                    
#    等待页面打开并截图
    def waitOpenPage(self,popObjArr=[],imgName='',msg=''):
        poco = self.poco
        ret = True
        if(len(popObjArr)!=0):
            try:
                poco.wait_for_any(popObjArr,10) 
            except:
                print(msg+'打开超时，请检查原因')
                ret = False
            else:
                print(msg+'已经打开') 
        sleep(2.0)
        if(len(imgName)!=0):
            filename = super().get_snapshot_name(super().validateTitle(imgName)+'.jpg')
            snapshot(filename=filename,msg=msg)
        return ret
    def getPage(self):
        poco = self.poco
        pages = poco("android:id/content").child(type="android.widget.FrameLayout").child(type="android.widget.FrameLayout").child(type="android.widget.FrameLayout").child(type="android.widget.FrameLayout").child(type="android.widget.FrameLayout")
        index = 0
        while not pages.exists():
            index+=1
            if index>3:
                break
            print('获取pages中...')
            poco("更多").click()
            sleep(1.0)
            touch(v=[(0.5*self.device_info['width']),(0.1*self.device_info['height'])])
            sleep(1.0)
        print('pages:',len(pages))
        page = pages[len(pages)-1]
        # print(self.getPagePath(page))
        return page
    def getPagePath(self,page):
        webViews = page.offspring('android.webkit.WebView')
        str = ''
        for i in range(len(webViews)):
            webView = webViews[i]
            str += webView.attr('text')
        return str 
    def pageBack(self):
        poco = self.poco
        sleep(1.0)
        if(exists(Template(r"tpl1566183570051.png", record_pos=(-0.441, -0.769), resolution=(1080, 500)))):
            touch(Template(r"tpl1566183570051.png", record_pos=(-0.441, -0.769), resolution=(1080, 500)))
        else:
            if(exists(Template(r"tpl1566186316304.png", record_pos=(-0.447, -0.769), resolution=(1080, 500)))):
                touch(Template(r"tpl1566186316304.png", record_pos=(-0.447, -0.769), resolution=(1080, 500)))
        sleep(1.0)
        while poco(text="加载中").exists():
             sleep(1.0)
        return
#     测试首页弹框
#     bool True(关闭)/False(点击测试)
    def testHomeCollar(self,bool=True):
        poco = self.poco
        self.waitOpenPage([poco(text='保洁')],'home','首页')
        webView = poco("android.webkit.WebView")
        webView_y = webView.get_size()[1]
        views = webView.child('android.view.View')
        for view in views:
            size = view.get_size()
            if(size[0]==1 and size[1]==webView_y):
                if(bool):
                    views[len(views)-1].click()
                    print('有首页弹框-关闭')
                else:
                    view.click()
                    print('有首页弹框-测试')
                    #测试代码-----------
    def AddressAuthorization(self):
        poco = self.poco
        if(poco(text="地理位置授权").exists()):
            poco(text="确定").click()










