const Controller = require('egg').Controller
const {filterConfig} = require('../../config/issues')
class ConfigurationController extends Controller {
    async add () {
        const {configuration} = this.ctx.service
        const {key, value, type} = this.ctx.query
        if(key && value) {
            try {
                let data = {}
                if(key === 'filter') {
                    if(type && filterConfig[type]) {
                        if(filterConfig[type].check && filterConfig[type].check(value)) {
                            data[key] = type + '——' + value
                            configuration.addElToArr(data)
                        }else{
                            this.ctx.body = {
                                code: 1,
                                msg: type + '参数格式不正确'
                            }
                            return
                        }
                    }else{
                        this.ctx.body = {
                            code: 1,
                            msg: 'type参数缺少/错误'
                        }
                        return
                    }
                }else{
                    data[key] = value
                    configuration.addElToArr(data)
                }
                this.ctx.body = {
                    code: 0,
                    msg: '添加成功'
                }
            } catch (error) {
                this.ctx.body = {
                    code: 2,
                    msg: error.toString()
                }
            }
        }else{
            this.ctx.body = {
                code: 1,
                msg: '缺少参数key/value'
            }
        }
    }
    async remove () {
        const {configuration} = this.ctx.service
        const {key, value} = this.ctx.query
        if(key && value) {
            try {
                let data = {}
                data[key] = value
                configuration.removeElToArr(data)
                this.ctx.body = {
                    code: 0,
                    msg: '删除成功'
                }
            } catch (error) {
                this.ctx.body = {
                    code: 2,
                    msg: error.toString()
                }
            }
        }else{
            this.ctx.body = {
                code: 1,
                msg: '缺少参数key/value'
            }
        }
    }
}

module.exports = ConfigurationController
