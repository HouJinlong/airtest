function padzero (n, len) {
    if (n >= 10) {
        return n
    }
    let str = '' + n
    let l = str.length
    while (l < len) {
        str = '0' + str
        l++
    }
    return str
}

const fiveMinuteArray = []
for (let i = 0; i < 24; i++) {
    const hour = i
    for (let j = 0; j < 12; j++) {
        const minute = j * 5
        fiveMinuteArray.push(padzero(hour, 2) + ':' + padzero(minute, 2))
    }
}

module.exports.TIME = {
    ONE_MINUTE_MILLISECOND: 1000 * 60,
    ONE_DAY_MILLISECOND: 1000 * 60 * 60 * 24,
    FIVE_MINUTE_ARRAY: fiveMinuteArray
}

module.exports.getToday = () => {
    const now = new Date()
    return now.getFullYear() + '-' + padzero(now.getMonth() + 1, 2) + '-' + padzero(now.getDate(), 2)
}

module.exports.getYesterday = () => {
    const y = new Date(Date.now() - 3600 * 1000 * 24)

    return y.getFullYear() + '-' + padzero(y.getMonth() + 1, 2) + '-' + padzero(y.getDate(), 2)
}

module.exports.getDay = timestamp => {
    const day = new Date(timestamp)
    return day.getFullYear() + '-' + padzero(day.getMonth() + 1, 2) + '-' + padzero(day.getDate(), 2)
}

module.exports.getBeforeDay = (d, diff = 30) => {
    // 返回30天前
    if (d) {
        d = new Date(d)
    } else {
        d = Date.now()
    }
    const y = new Date(d - 3600 * 1000 * 24 * diff)

    return y.getFullYear() + '-' + padzero(y.getMonth() + 1, 2) + '-' + padzero(y.getDate(), 2)
}
