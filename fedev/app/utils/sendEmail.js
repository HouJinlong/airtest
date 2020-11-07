const nodemailer = require('nodemailer')
const sd = require('silly-datetime')
const domain = 'http://fedev.djtest.cn:17001'
exports.sendtest = async function (toEmail, subject) {
    await send({
        to: toEmail,
        subject,
        html: `测试邮箱是否可以正常接受信息`
    })
}

exports.sendIssueList = async function (data) {
    Object.keys(data).forEach(toEmail => {
        const toEmailData = data[toEmail]
        if (Object.keys(toEmailData).length > 0) {
            send({
                to: toEmail,
                subject: '【sentry新问题通知】【' + sd.format(new Date(), 'YYYY-MM-DD HH:mm') + '】',
                html: getIssueListEmailTemp(toEmailData)
            })
        }
    })
}
function getIssueListEmailTemp (data) {
    let temp = ''
    for (x in data) {
        temp += `<div style="clear:both;"><table align="center" style="border-collapse:collapse;border:1.0px solid #666666;width:897.0px;">
                <tbody>
                    <tr>
                        <td align="center" class="" colspan="5" rowspan="1" valign="top" width="174"
                            style="border:1.0px solid #666666;padding:3.0px 8.0px;background-color:#fac08f;">
                            <div style="clear:both;text-align:center;vertical-align:top;">
                            <a
                                href="http://fedev.djtest.cn:17001/sentry?project=${x}&status=1"
                                target="_blank"text-align:left;vertical-align:middle;"
                                rel="noopener"><span
                                style="text-align:center;vertical-align:top;font-weight:700;">${x}</span></a>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" class="" colspan="1" rowspan="1" valign="top" width="465"
                            style="border:1.0px solid #666666;padding:3.0px 8.0px;background-color:#d8d8d8;">
                            <div style="clear:both;text-align:center;vertical-align:top;"><span
                                    style="font-weight:700;">错误信息</span></div>
                        </td>
                        <td align="center" class="" colspan="1" rowspan="1" valign="top" width="116"
                            style="border:1.0px solid #666666;padding:3.0px 8.0px;background-color:#d8d8d8;">
                            <div style="clear:both;text-align:center;vertical-align:top;"><span
                                    style="color:#333333;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14.0px;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;text-align:center;text-indent:.0px;text-transform:none;text-decoration-style:initial;text-decoration-color:initial;float:none;vertical-align:top;display:inline;font-weight:700;">首次出现</span>
                            </div>
                        </td>
                        <td align="center" class="" colspan="1" rowspan="1" valign="top" width="99"
                            style="border:1.0px solid #666666;padding:3.0px 8.0px;background-color:#d8d8d8;">
                            <div style="clear:both;text-align:center;vertical-align:top;"><span
                                    style="color:#333333;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14.0px;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;text-align:center;text-indent:.0px;text-transform:none;text-decoration-style:initial;text-decoration-color:initial;float:none;vertical-align:top;display:inline;font-weight:700;">最后出现</span>
                            </div>
                        </td>
                        <td align="center" class="" colspan="1" rowspan="1" valign="top" width="56"
                            style="border:1.0px solid #666666;padding:3.0px 8.0px;background-color:#d8d8d8;">
                            <div style="clear:both;text-align:center;vertical-align:top;"><span
                                    style="color:#333333;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14.0px;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;text-align:center;text-indent:.0px;text-transform:none;text-decoration-style:initial;text-decoration-color:initial;float:none;vertical-align:top;display:inline;font-weight:700;">count</span>
                            </div>
                        </td>
                        <td align="center" class="" colspan="1" rowspan="1" valign="top" width="70"
                            style="border:1.0px solid #666666;padding:3.0px 8.0px;background-color:#d8d8d8;">
                            <div style="clear:both;text-align:center;vertical-align:top;"><span
                                    style="color:#333333;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14.0px;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;text-align:center;text-indent:.0px;text-transform:none;text-decoration-style:initial;text-decoration-color:initial;float:none;vertical-align:top;display:inline;font-weight:700;">user</span>
                            </div>
                        </td>
                    </tr>
                    ${data[x].map(({ firstSeen, lastSeen, url, title, count, userCount }) => {
        const firstSeenArr = sd.format(firstSeen).split(' ')
        const lastSeenArr = sd.format(lastSeen).split(' ')
        return `<tr>
                                <td align="left" class="" valign="middle" width="465"
                                    style="border:1.0px solid #666666;padding:3.0px 8.0px;">
                                    <div style="clear:both;text-align:left;vertical-align:middle;"><a
                                            href="${url}"
                                            target="_blank"
                                            style="font-size:10.0px;text-decoration:underline;text-align:left;vertical-align:middle;"
                                            rel="noopener"><span
                                                style="font-size:10.0px;text-align:left;vertical-align:middle;">${title}</span></a><br
                                            style="text-align:left;vertical-align:middle;"></div>
                                </td>
                                <td align="center" class="" valign="middle" width="116"
                                    style="border:1.0px solid #666666;padding:3.0px 8.0px;">
                                    <div style="clear:both;text-align:center;vertical-align:middle;"><span
                                            style="text-align:center;vertical-align:middle;font-size:12.0px;"><span
                                                style="border-bottom:1px dashed #ccc;" t="5"
                                                times="">${firstSeenArr[0]}</span></span></div>
                                    <div style="clear:both;text-align:center;vertical-align:middle;"><span
                                            style="font-size:12.0px;">${firstSeenArr[1]}</span></div>
                                </td>
                                <td align="center" class="" valign="middle" width="99"
                                    style="border:1.0px solid #666666;padding:3.0px 8.0px;">
                                    <div style="clear:both;text-align:center;vertical-align:middle;"><span
                                            style="text-align:center;vertical-align:middle;font-size:12.0px;"><span
                                                style="border-bottom:1px dashed #ccc;" t="5"
                                                times="">${lastSeenArr[0]}</span></span></div>
                                    <div style="clear:both;text-align:center;vertical-align:middle;"><span
                                            style="text-align:center;vertical-align:middle;font-size:12.0px;">${lastSeenArr[1]}</span>
                                    </div>
                                </td>
                                <td align="center" class="" colspan="1" rowspan="1" valign="middle" width="56"
                                    style="border:1.0px solid #666666;padding:3.0px 8.0px;">
                                    <div style="clear:both;text-align:center;vertical-align:middle;">${count}</div>
                                </td>
                                <td align="center" class="" colspan="1" rowspan="1" valign="middle" width="70"
                                    style="border:1.0px solid #666666;padding:3.0px 8.0px;">
                                    <div style="clear:both;text-align:center;vertical-align:middle;">${userCount}</div>
                                </td>
                            </tr>`
    }).join('')}
                </tbody>
            </table>
            <div style="clear:both;"></div>
            <div style="clear:both;"></div>
            <div style="clear:both;"></div>
            <div style="clear:both;"><br></div>
        </div>`
    }

    return `<div class="__aliyun_email_body_block">
                <div style="line-height:1.7;font-family:Tahoma,Arial,STHeiti,SimSun;font-size:14.0px;color:#000000;">
                    <div style="line-height:1.7;font-family:Tahoma,Arial,STHeiti,SimSun;font-size:14.0px;color:#000000;">
                        ${temp}
                    </div>
                </div>
            </div>`
}

exports.sendAirTest = function ({ email = '', ...data }) {
    const emailArr = email.split(',')
    if (emailArr.length > 0) {
        const statusArr = [
            '等待中',
            '进行中',
            '成功',
            '失败' + (data.msg ? ': ' + data.msg : '')
        ]
        statusArr[data.status]
        const statusText = statusArr[data.status]
        emailArr.forEach(v => {
            send({
                to: v,
                subject: '【自动化测试通知】【测试任务( ' + data.id + ') 运行' + statusText + ')】',
                html: getAirTestEmailTemp(Object.assign(data, {
                    url: domain + '/airtest/tasks?airId=' + data.airId + '&client=' + data.client,
                    statusText,
                    log_url: domain + data.log_url,
                    diffImgsUrl: domain + '/airtest/analysis?id=' + data.id
                }))
            })
        })
    }
}

function getAirTestEmailTemp ({ url, id, git_id, path, title, device_id, log_url, time, statusText, logUrl, base, version, diff_imgs, diffImgsUrl }) {
    let analysistr = ''
    if (diff_imgs && base) {
        const context = diff_imgs.length === 0 ? '运行截图相同' : `共有${diff_imgs.length}个不同`
        analysistr = `
            <tr>
                <td colspan="1" rowspan="1" valign="top"
                    style="border:1.0px solid #666666;padding:5.0px 10.0px;background-color:#d8d8d8;">
                    对比基准
                </td>
                <td class="" valign="middle"
                    style="border:1.0px solid #666666;padding:5.0px 10.0px;">
                    ${base}
                </td>
            </tr>
            <tr>
                <td colspan="1" rowspan="1" valign="top"
                    style="border:1.0px solid #666666;padding:5.0px 10.0px;background-color:#d8d8d8;">
                    结果分析
                </td>
                <td class="" valign="middle"
                    style="border:1.0px solid #666666;padding:5.0px 10.0px;">
                    <a href="${diffImgsUrl}" target="_blank"  style="text-decoration:underline;text-align:left;vertical-align:middle;" rel="noopener">
                        ${context}
                    </a>
                </td>
            </tr>
        `
    }
    return `
        <div style="clear:both;">
            <table  style="border-collapse:collapse;border:1.0px solid #666666;width:500px;line-height:20px">
                <tbody>
                    <tr>
                        <td colspan="1" rowspan="1" valign="top"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;background-color:#d8d8d8;">
                            id
                        </td>
                        <td class="" valign="middle"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;">
                            ${id}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1" rowspan="1" valign="top"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;background-color:#d8d8d8;">
                            脚本项目
                        </td>
                        <td class="" valign="middle"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;">
                            ${git_id}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1" rowspan="1" valign="top"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;background-color:#d8d8d8;">
                            脚本路径
                        </td>
                        <td class="" valign="middle"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;">
                            ${path}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1" rowspan="1" valign="top"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;background-color:#d8d8d8;">
                            脚本备注
                        </td>
                        <td class="" valign="middle"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;">
                            ${title}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1" rowspan="1" valign="top"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;background-color:#d8d8d8;">
                            脚本版本
                        </td>
                        <td class="" valign="middle"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;">
                            ${version}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1" rowspan="1" valign="top"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;background-color:#d8d8d8;">
                            运行设备
                        </td>
                        <td class="" valign="middle"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;">
                            ${device_id}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1" rowspan="1" valign="top"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;background-color:#d8d8d8;">
                            状态
                        </td>
                        <td class="" valign="middle"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;">
                            ${statusText}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1" rowspan="1" valign="top"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;background-color:#d8d8d8;">
                            运行报告
                        </td>
                        <td class="" valign="middle"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;">
                            <a
                                href="${log_url}"
                                target="_blank"
                                style="text-decoration:underline;text-align:left;vertical-align:middle;"
                                rel="noopener">查看报告</a>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1" rowspan="1" valign="top"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;background-color:#d8d8d8;">
                            添加时间
                        </td>
                        <td class="" valign="middle"
                            style="border:1.0px solid #666666;padding:5.0px 10.0px;">
                            ${time}
                        </td>
                    </tr>
                    ${analysistr}
                </tbody>
            </table>
            <div style="clear:both;"></div>
        </div>
    `
}

exports.sendUpdateTestCode = async function (email, data) {
    await send({
        to: email,
        subject: '【代码更新测试分支任务通知】【' + sd.format(new Date(), 'YYYY-MM-DD HH:mm') + '】',
        html: getUpdateTestCodeTemp(data)
    })
}
function getUpdateTestCodeTemp (data) {
    return `
        <div style="clear:both;"><table align="center" style="border-collapse:collapse;border:1.0px solid #666666;width:897.0px;">
            <tbody>
            <tr>
                <td
                    style="border:1.0px solid #666666;padding:3.0px 8.0px;background-color:#ccc;" width="200">
                    <div >
                    <a
                        href="${data.web_url}"
                        target="_blank"text-align:left;vertical-align:middle;"
                        rel="noopener">${data.web_url}</a>
                    </div>
                </td>
                <td
                    style="border:1.0px solid #666666;padding:3.0px 8.0px">
                    <div >
                    ${data.msg}
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    `
}

function send (mailOptions) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport(
            {
                host: 'smtp.mxhichina.com',
                secureConnection: true,
                auth: {
                    user: '邮箱账号',
                    pass: '邮箱密码'
                }
            }, {
                from: 'ptfe-info@daojia-inc.com'
            }
            // {
            //     service: 'qq',
            //     port: 465,
            //     secureConnection: true,
            //     auth: {
            //         user : '',
            //         pass : ''
            //     }
            // },{
            //     from:'',
            // }

        )

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        })
    })
}

