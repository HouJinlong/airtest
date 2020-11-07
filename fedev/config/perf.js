exports.pageAttrConf = {
    pageWebkitPrepareTime: 'webview初始化时间',
    pageRequestHtmlTime: 'HTML响应时间',
    pageRequestResourceTime: '静态资源请求时间',
    pageApiTime: 'Api请求时间',
    pageRenderTime: '页面渲染时间',
    pageWholeTime: '总加载耗时'
}

exports.pageIdConf = {
    catg: { id: 1, name: '大类页' }, // 大类页
    list: { id: 3, name: '列表页' }, // 列表页
    detail: { id: 5, name: '详情页' }, // 详情页
    direct: { id: 7, name: '直约页' }, // 直约页
    pay: { id: 11, name: '收银台' }, // 收银台
    search: { id: 13, name: '搜索页' } // 搜索页
}

exports.channelConf = {
    dj_app: { ind: 0, name: '到家APP' },
    '58_app': { ind: 1, name: '同城App' },
    ganji_app: { ind: 2, name: '赶集APP' },
    weixin: { ind: 3, name: '微信H5渠道' },
    web: { ind: 4, name: 'web' },
    weixin_mini: { ind: 5, name: '微信小程序' },
    alipay_mini: { ind: 6, name: '支付宝小程序' },
    alipay: { ind: 7, name: '支付宝客户端' }
}


exports.osConf = {
    iOS: 'iOS',
    android: 'android'
}

