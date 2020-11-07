const Service = require('egg').Service
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const sendEmail = require('../utils/sendEmail')
class ExportService extends Service {
    async fe_project_save (data) {
        const { project_id } = data
        const { root_dir } = this.config.fe_project_update_test
        if (!fs.existsSync(root_dir)) {
            fs.mkdirSync(root_dir)
        }
        const json_file = path.join(root_dir, String(project_id)) + '.json'
        console.log(json_file, fs.existsSync(json_file))
        if (!fs.existsSync(json_file)) {
            fs.writeFileSync(json_file, JSON.stringify(data, null, 2), 'utf8')
        }
    }

    fe_project_update () {
        const { root_dir, email, deploy_dir_config } = this.config.fe_project_update_test
        if (!fs.existsSync(root_dir)) {
            return
        }
        const list = fs.readdirSync(root_dir).filter(v => {
            return v.includes('.json')
        })
        const updata_git_ssh_url_arr = []
        list.forEach(v => {
            const file = path.join(root_dir, v)
            const data = JSON.parse(fs.readFileSync(file))
            const deploy_dir = deploy_dir_config[data.project.git_ssh_url]
            updata_git_ssh_url_arr.push(data.project.git_ssh_url)
            if (deploy_dir) {
                const cmd = `sh sh/deploy.sh ${root_dir} ${data.project.git_ssh_url} ${data.project_id} ${deploy_dir} `
                const child = exec(cmd, {
                    encoding: 'utf8',
                    detached: true,
                    stdio: 'ignore'
                }, (error, stdout, stderr) => {
                    const emailData = {
                        web_url: data.project.web_url
                    }
                    if (error) {
                        emailData.msg = `【cmd】：${cmd} <br/> 【err】:${error.toString()}`
                    } else if (stdout.indexOf('deploy done') === -1) {
                        emailData.msg = `【cmd】：${cmd} <br/>【stdout】:  + ${stdout}<br/> 【stderr】：${stderr}`
                    }
                    if (emailData.msg) {
                        sendEmail.sendUpdateTestCode(email, emailData)
                    }
                })
                child.unref()
                fs.unlinkSync(file)
            } else {
                sendEmail.sendUpdateTestCode(email, {
                    web_url: data.project.web_url,
                    msg: `未配置key为${data.project.git_ssh_url}的部署地址`
                })
            }
        })
        return updata_git_ssh_url_arr
    }
}
module.exports = ExportService

