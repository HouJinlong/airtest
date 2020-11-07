const Controller = require('egg').Controller
const { throw_err } = require('../../utils/tools')
const { getLogSnapshot } = require('../../utils/airtest')
class ExportController extends Controller {
    // 任务记录 分析结果页面
    async analysis () {
        const { tasks } = this.ctx.service.airtest
        try {
            const imgPrefix = this.config.domain + this.config.static.prefix
            const { id = throw_err('缺少参数id') } = this.ctx.query
            const ret = (await tasks.get({ id }))[0]
            const { logDir } = this.config.airtest
            if (ret && ret.base) {
                try {
                    const [ imgs, baseImgs ] = await Promise.all([
                        getLogSnapshot(logDir, id),
                        getLogSnapshot(logDir, ret.base)
                    ])
                    this.ctx.body = {
                        code: 0,
                        message: '成功',
                        data: {
                            imgPrefix,
                            id,
                            base_id: ret.base,
                            imgs,
                            baseImgs,
                            diffImgs: ((ret.diff_imgs||[]).map(v => {
                                return '/snapshot/' + v
                            }) || [])
                        }
                    }
                } catch (error) {
                    throw_err('图片读取失败')
                }

            } else {
                throw_err('未找到任务记录【' + id + '】')
            }

        } catch (error) {
            this.ctx.logger.error(error)
            this.ctx.body = {
                code: 2,
                message: error.toString()
            }
        }
    }
}

module.exports = ExportController
