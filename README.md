# 端上自动化监控系统2.0

## 概述

[端上自动化监控系统1.0](./1.0/端上自动化监控系统1.0.pptx) 

> 通过脚本模拟认为操作，使用产品，并进行截图与基准运行截图进行对比，当脚本运行失败或者图片对比差异超过允许范围进行邮件提醒

背景：项目迭代，优化，bug修复等QA同事任务多排期紧以及回归测试无法完全覆盖
目标：通过技术手段降低成本，增加开发效率，更好的支持业务迭代，保证产出质量

解决问题:
1. 业务的回归测试更方便。特别是在程序修改比较频繁时，效果是非常明显的。由于回归测试的动作和用例是完全设计好的，测试期望的结果也是完全可以预料的，将回归测试自动运行，可以极大提高测试效率，缩短回归测试时间。
2. 保证了基本下单流程和批量配置页面的可用性
3. 通过图片对比可以更容易的发现，页面的变化，对前端发版的修改有更只管的了解
4. 可以记录产品的各版本页面和流程变动

## 2.0

一、概述

对端上自动化监控系统 进行优化

1. 前后端分离重写项目
2. case执行完成后，需给多人发邮件（目前只支持一人）；
3. 脚本支持多git多工程：保洁侧，商家侧、小程序侧等需要在不同的git地址上，层次结构清晰，有利于维护；
4. 脚本执行时可支持多个手机同时执行，需存放每台手机执行的报告，每台手机的报告都可以和基准报告做对比；如果支持多台手机可方便测试回归兼容性来提高测试效率
5. 兼容ios机型测试（未完成）
6. 报告模板采用更直观的 旧版

## 目录概述

```
.
├── 1.0
│   └── 端上自动化监控系统1.0.pptx 
├── README.md
├── airs                                    自动化测试脚本
│   └── airtest-demo                        测试自动化测试脚本项目
├── auto_test_admin                         自动化测试的前端项目，配置脚本，产看设备，运行任务，产看报告
├── auto_test_client                        自动化测试脚本的运行项目
│   ├── auto_test_client                    django 写的 python web 项目，电脑与手机建立tcpip链接和手机产看当前的链接状态
│   ├── auto_test_script                    python对airtest脚本执行器自定义，控制自动化脚本的运行
└── fedev                                   后端egg项目，其中airtest是自动化测试的
```

## 学习到的知识

1. 了解了一门新语言python，以及很多新的知识点adb,app运行和小程序运行等等 
2. 了解了平时工作相关但未关注的测试工作，学会了从测试的角度去看代一个产品
3. 项目开发中先不要急于实现，而是提出几种方案，经过充分讨论之后选择合适的方案再实现，这样效率更高，集思广益，避免自己眼见，想法局限性导致的无用功
4. 复杂的任务需要拆解成几个小的子任务，然后逐步完成，而不是全部一起完成，降低复杂度同时完成阶段性的目标的达成。
5. 分析任务的关键路径，先实现关键路径，然后再去完善细节，避免过度设计，以及进展缓慢


## 遗憾

1.0做完，2.0进行到一半时，公司组织架构调整，部门与另一个部门合并，业务的侧重点调整，忙着坐其他事，2.0并没有像1.0一样部署使用起来，后边自己完善了做到能跑起来就完了，代码结构的划分，配置和业务的分离，以及还有很多不合理的地方还有待改进，而且随着深入也慢慢发现一些局限性，后来便没有投入过多的精力... 唉~
