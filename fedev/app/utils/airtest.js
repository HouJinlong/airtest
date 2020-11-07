const readline = require('readline')
const fs = require('fs')
const join = require('path').join
const snapshot_dir = 'snapshot\\'
module.exports.getLogSnapshot = (logDir, id) => {
    const logPath = join(logDir, id, 'report', 'log', 'log.txt')
    console.log(logPath)
    return new Promise((resolve, reject) => {
        if (logPath) {
            try {
                const r1 = readline.createInterface({
                    input: fs.createReadStream(logPath)
                })
                const imgs = []
                r1.on('line', function (line) {
                    if (line.indexOf(snapshot_dir) !== -1) {
                        try {
                            const log = JSON.parse(line)
                            const { filename, msg } = log.data.call_args
                            const img = filename.split(snapshot_dir)[1]
                            if (img && imgs.indexOf(img) === -1) {
                                imgs.push({
                                    img: '/snapshot/' + img,
                                    msg
                                })
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                })
                r1.on('close', function () {
                    resolve(imgs)
                })
            } catch (error) {
                reject(new Error('参数 logPath错误'))
            }
        } else {
            reject(new Error('参数 logPath错误'))
        }
    })
}

