const Controller = require('egg').Controller
const { throw_err } = require('../../utils/tools')
const sd = require('silly-datetime')
const compressing = require('compressing')
const fs = require('fs')
const join = require('path').join
const sendEmail = require('../../utils/sendEmail')
const { exec } = require('child_process')
class ExportController extends Controller {
    async get () {
        const { tasks, gits, devices } = this.ctx.service.airtest
        try {

            const { device_id = throw_err('缺少参数 device_id') } = this.ctx.query
            const data = (await tasks.get({
                status: {
                    $lte: 1
                },
                device_id
            }))[0]
            if (data) {
                const [ git, device ] = await Promise.all([
                    gits.get({ id: data.git_id }),
                    devices.get({ id: data.device_id })
                ])
                console.log(git, device)
                data.git_url = git[0].url
                if (git[0].version) {
                    data.git_update = false
                } else {
                    data.git_update = true
                }
                data.device_ip = device[0].ip
                this.ctx.body = {
                    code: 0,
                    message: '成功',
                    data
                }
            } else {
                this.ctx.body = {
                    code: 1,
                    message: '暂无需要执行的任务'
                }
            }
        } catch (error) {
            this.ctx.logger.error(error)
            this.ctx.body = {
                code: 2,
                message: error.toString()
            }
        }
    }
    async get_list () {
        const { page_number, page_size, git_id, air_id, status } = this.ctx.query
        try {
            const { tasks } = this.ctx.service.airtest
            const query = {}
            if (status) {
                query.status = status
            }
            if (git_id) {
                query.git_id = git_id
            }
            if (air_id) {
                query.air_id = air_id
            }
            this.ctx.body = {
                code: 0,
                message: '成功',
                data: (await tasks.get_list(query, { page_number, page_size }))
            }
        } catch (error) {
            this.ctx.logger.error(error)
            this.ctx.body = {
                code: 2,
                message: error.toString()
            }
        }
    }
    async add () {
        const { airs, tasks, devices } = this.ctx.service.airtest
        try {
            let { air_ids = throw_err('缺少参数 air_ids'),
                device_ids } = this.ctx.request.body
            const time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
            if (air_ids.length > 0) {
                // 根据id查询
                const airs_info = await Promise.all(air_ids.map(id => {
                    return new Promise(async (resolve, reject) => {
                        const airs_arr = await airs.get({ _id: id })
                        if (airs_arr[0] && airs_arr[0]._id) {
                            resolve(airs_arr[0])
                        } else {
                            reject(new Error('不存在脚本id:' + id))
                        }
                    })
                }))
                if (!device_ids) {
                    device_ids = (await devices.get({
                        status: 0
                    })).map(v => {
                        return v.id
                    })
                }
                const tasks_arr = []
                device_ids.forEach(device_id => {
                    airs_info.forEach(v => {
                        const { _id, path, title, git_id, base, type, email } = v
                        tasks_arr.push({
                            air_id: _id,
                            path, title, git_id, base, type, email,
                            device_id,
                            status: 0,
                            time
                        })
                    })
                })
                await tasks.add(tasks_arr)
                this.ctx.body = {
                    code: 0,
                    message: '添加成功'
                }
            } else {
                throw_err('air_ids 为空')
            }
        } catch (error) {
            this.ctx.logger.error(error)
            this.ctx.body = {
                code: 2,
                message: error.toString()
            }
        }
    }
    async update () {
        const { tasks, devices, airs } = this.ctx.service.airtest
        const { logDir } = this.config.airtest

        const { files } = this.ctx.request
        const { id, status, msg, diffImgs, version, is_base } = this.ctx.request.body
        console.log({ id, status, msg, diffImgs })
        try {
            if (id) {
                const data = {}
                const ret = (await tasks.get({ id }))[0]
                if (ret) {
                    console.log(files)
                    // 有文件
                    if (files && files[0]) {
                        const file = files[0]
                        const output = join(logDir, ret.id)
                        // 解压文件
                        await compressing.zip.uncompress(file.filepath, output)
                        // 删除临时文件
                        fs.unlinkSync(file.filepath)
                        // 更新数据库
                        if (fs.existsSync(join(output, 'report', 'log.html'))) {
                            data.log_url = join('/public', ret.id, 'report', 'log.html')
                        }
                    }

                    if (status) {
                        data.status = (status * 1)
                        // 更新设备表
                        if (data.status === 1) {
                            await devices.update({ id: ret.device_id }, { task_id: ret.id })
                        } else {
                            await devices.update({ id: ret.device_id }, { task_id: '' })
                        }
                        // 成功
                        if (data.status === 2) {
                            if (ret.base) {
                                exec(`node /home/work/workHome/fejob/atest/src/snap_diff.js ${logDir} ${ret.base} ${ret.id}`)
                            } else {
                                await sendEmail.sendAirTest(Object.assign(ret, data))
                            }
                        }
                        // 失败
                        if (data.status === 3) {
                            if (msg) {
                                data.msg = msg
                            }
                            await sendEmail.sendAirTest(Object.assign(ret, data))
                        }
                    }
                    if (version) {
                        data.version = version
                    }
                    if (diffImgs) {
                        data.diff_imgs = diffImgs
                        await sendEmail.sendAirTest(Object.assign(ret, data))
                    }

                    if (is_base) {
                        data.is_base = true
                        tasks.update({ air_id: ret.air_id, base: true }, { base: false })
                        await airs.update({ _id: ret.air_id }, { base: ret.id })
                    } else {
                        data.is_base = false
                        await airs.update({ _id: ret.air_id }, { base: '' })
                    }

                    await tasks.update({ id }, data)
                    this.ctx.body = {
                        code: 0,
                        message: '成功'
                    }
                } else {
                    this.ctx.body = {
                        code: 1,
                        message: '参数id错误'
                    }
                    return
                }
            } else {
                this.ctx.body = {
                    code: 1,
                    message: '缺少参数id'
                }
            }
        } catch (error) {
            this.ctx.logger.error(error)
            this.ctx.body = {
                code: 2,
                message: error.toString()
            }
        }

    }
    async del () {
        const { tasks } = this.ctx.service.airtest
        try {
            const { id = throw_err('缺少参数 id') } = this.ctx.request.body
            const data = (await tasks.get({ id }))[0]
            if (data) {
                this.ctx.body = {
                    code: 0,
                    message: '成功',
                    data: (await tasks.del({ id }))
                }
            } else {
                throw_err('未找到或不可删除 id:' + id)
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
