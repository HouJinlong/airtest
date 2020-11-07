# airtest 测试用例
[AirtestIDE](http://airtest.netease.com/docs/cn/index.html "AirtestIDE") + [python教程](https://www.runoob.com/python/python-tutorial.html) + 俩个python库[Airtest](https://github.com/AirtestProject/Airtest) + [Poco](https://github.com/AirtestProject/Poco)
## 文件夹说明
#### 1.项目文件夹说明
|  app/ |  wx_xcx/ | common/ | temp/ |custom_launcher.py |timedTask.py| report |
| ------------ | ------------ |------------ |------------ |------------ |------------ |------------ |
|  用户app Android测试用例 |  用户侧小程序测试用例 | 测试用例公共方法 | 存放一些项目需要但与代码无关的东西 |自定义启动器，通过该文件来运行脚本|与[fedev](http://git.daojia-inc.com/felib/fedev "fedev")实现脚本自动运行| 运行报告存放目录 |
## 运行
#### 环境准备
1. 安装 `Python3`

2. pip install -r requirements.txt 安装项目依赖


#### 测试前准备
1. [连接设备](http://airtest.netease.com/docs/cn/2_device_connection.html)

2. 测试用户app Android需要先安装`测试版app`,测试用户侧小程序，需要先把小程序添加到我的小程序中，自己处理登录弹框授权

> 注意：微信不要双开

#### 运行
1. 与【前端数据聚合平台】配合运行 timedTask.py
![http://confluence.daojia-inc.com/download/attachments/94668100/image2019-10-29%2017%3A46%3A35.png?version=1&modificationDate=1572342398038&api=v2](http://confluence.daojia-inc.com/download/attachments/94668100/image2019-10-29%2017%3A46%3A35.png?version=1&modificationDate=1572342398038&api=v2 "http://confluence.daojia-inc.com/download/attachments/94668100/image2019-10-29%2017%3A46%3A35.png?version=1&modificationDate=1572342398038&api=v2")

2. 命令行单独调用 custom_launcher.py
![http://confluence.daojia-inc.com/download/attachments/94668100/image2019-10-29%2017%3A47%3A59.png?version=1&modificationDate=1572342481821&api=v2](http://confluence.daojia-inc.com/download/attachments/94668100/image2019-10-29%2017%3A47%3A59.png?version=1&modificationDate=1572342481821&api=v2 "http://confluence.daojia-inc.com/download/attachments/94668100/image2019-10-29%2017%3A47%3A59.png?version=1&modificationDate=1572342481821&api=v2")

3. ide运行 custom_launcher.py
选项 > 设置 > 自定义Launcher文件路径（选中custom_launcher.py文件）> 打开需要运行的脚本，点击运行


## 编写
- [airtest-ide文档](http://airtest.netease.com/docs/cn/1_quick_start.html)
- [poco文档](https://poco.readthedocs.io/zh_CN/latest/source/README.html)
- [Airtest文档](https://airtest.readthedocs.io/zh_CN/latest/)
- [Android原生App测试api使用方法](https://poco.readthedocs.io/en/latest/source/doc/drivers/android-native-app.html)
- [python教程](https://www.runoob.com/python/python-tutorial.html)
- [ADB](https://juejin.im/post/5d2a1586f265da1b7e106596#heading-10)

## 备注
1.[Poco受webview限制问题](https://airtest.netease.com/docs/cn/6_poco_framework/poco_webview.html)安装项目temp内最新的 `Google-WebView`

```shell
// 查看手机默认webview
adb shell am start -a android.intent.action.VIEW -d  https://liulanmi.com/labs/core.html
// 安装webview
adb install -r temp/com-google-android-webview1565323200.apk
```
2.app的widgetId混淆问题，项目内部有未混淆的包

```shell
//查看设备安装的应用
adb shell pm list packages
//卸载已安装
adb uninstall com.wuba.jiazheng
//安装
adb install temp/app-release-7.0.0.apk
```

