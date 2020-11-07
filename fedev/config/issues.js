// 任务状态 与索引对应
exports.status = [
    '未开始',
    '解决中',
    '已解决',
    '删除'
]

// 过滤规则 =
exports.filterConfig = {
    'titleStr': {
        text: 'title字符',
        check (val) {
            return (typeof val) === 'string'
        },
        filter (issues, rule) {
            let title = issues.title
            if (title.indexOf(rule) > -1) {
                return true
            }else{
                return false
            }
        }
    },
    'titleRegex': {
        text: 'title正则',
        check (val) {
            try {
                // eslint-disable-next-line no-new
                new RegExp(val)
                return true
            } catch (error) {
                return false
            }
        },
        filter (issues, rule) {
            let title = issues.title
            let ruleRegExp = new RegExp(rule)
            if (ruleRegExp.test(title)) {
                return true
            }else{
                return false
            }
        }
    },
    'count': {
        text: 'count小于',
        check (val) {
            return !isNaN(val * 1)
        },
        filter (issues, rule) {
            if(issues.count * 1 < rule * 1) {
                return true
            }else{
                return false
            }
        }
    },
    'userCount': {
        text: 'userCount小于',
        check (val) {
            return !isNaN(val * 1)
        },
        filter (issues, rule) {
            if(issues.userCount * 1 < rule * 1) {
                return true
            }else{
                return false
            }
        }
    }
}

