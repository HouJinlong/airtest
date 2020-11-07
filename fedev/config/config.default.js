// config/config.default.js
const path = require('path')
exports.keys = 'abcde'

exports.httpclient = {
    request: {
        // 默认 request 超时时间
        timeout: 3000,
        headers: {
            Authorization: 'Bearer 04a6ddaca3f44d2795e9940f457447b8d553be77be1d4f1792a871b054df31a0'
        },
        dataType: 'json'
    }
}

const sentryDomain = 'http://sentry.daojia.com'
exports.sentry = {
    pageSize: 5,
    issuesList: (organization_slug, project_slug) => `${sentryDomain}/api/0/projects/${organization_slug}/${project_slug}/issues/`,
    deleteIssues: issue_id => `${sentryDomain}/api/0/issues/${issue_id}/`,
    issuesDetail: (organization_slug, project_slug, id) => `${sentryDomain}/${organization_slug}/${project_slug}/issues/${id}`,
    issuesEvents: issue_id => `${sentryDomain}/api/0/issues/${issue_id}/events/`,
    eventsList: (organization_slug, project_slug) => `${sentryDomain}/api/0/projects/${organization_slug}/${project_slug}/events/`
}


// 添加 view 配置
exports.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
        '.tpl': 'nunjucks'
    }
}

exports.mongoose = {
    options: {
        debug: true
    },
    clients: {
        // clientId, access the client instance by app.mongooseDB.get('clientId')
        sentry: {
            url: 'mongodb://127.0.0.1/sentry_issues',
            options: {}
        },
        perform: {
            url: 'mongodb://127.0.0.1/ptfe-perform',
            options: {}
        },
        airtest: {
            url: 'mongodb://127.0.0.1/airtest',
            options: {}
        },
        trade_monitor: {
            url: 'mongodb://127.0.0.1/trade_monitor',
            options: {}
        }
    }
}

// 允许请求
exports.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
}

exports.security = {
    csrf: {
        enable: false
    }
}

exports.multipart = {
    mode: 'file',
    fileSize: '1000mb'
}

const data_dir = path.resolve('/opt/data/')
exports.data_dir = data_dir
// 自动化测试导出路径
const logDir = path.join(data_dir, 'atest')
// 多静态文件入口
exports.static = {
    prefix: '/public/',
    dir: [ 'app/public', logDir ]
}
// 自动话测试 文件存放路径
exports.airtest = {
    logDir
}


// FE项目master更新 测试环境代码更新
exports.fe_project_update_test = {
    root_dir: path.join(data_dir, 'fe_project_update_test'),
    email: 'houjinlong@daojia-inc.com',
    deploy_dir_config: {
        'git@git.daojia-inc.com:fe/wx-search.git': '/pt/project/wx-search',
        'git@git.daojia-inc.com:fe/wx-index-v2.git': '/assets/project/wx-index-v2',
        'git@git.daojia-inc.com:fe/dj-crm-c.git': '/pt/project/customer-c',
        'git@git.daojia-inc.com:fe/newRobOrder-c.git': '/pt/project/robOrder-c',
        'git@git.daojia-inc.com:fe/coupon-vue-cli.git': '/pt/project/coupon-vue-cli',
        'git@git.daojia-inc.com:fe/marketing-push.git': '/pt/project/marketing-push',
        'git@git.daojia-inc.com:fe/instant-order.git': '/pt/project/instant-order',
        'git@git.daojia-inc.com:fe/pre-instant-order.git': '/pt/project/pre-instant-order',
        'git@git.daojia-inc.com:fe/website-community-jiaxuan.git': '/pt/project/fe-website-community',
        'git@git.daojia-inc.com:fe/orderInsurance-c.git': '/pt/project/insurance-c',
        'git@git.daojia-inc.com:fe/delay_payment-c.git': '/pt/project/delay_payment-c/dist'
    }
}
