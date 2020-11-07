const Service = require('egg').Service
const newConfiguration = {
    type: 'Configuration',
    people: []
}


class ConfigurationService extends Service {

    async get () {
        const {Configuration} = this.ctx.model
        const result = await Configuration.find()
        if(result.length) {
            return result[0]
        }else{
            await Configuration.create(newConfiguration)
            return newConfiguration
        }
    }

    async getFilter () {
        const {configuration} = this.ctx.service
        const config = await configuration.get()
        return config.filter.map((v) => {
            var vArr = v.split('——')
            return {
                type: vArr[0],
                value: vArr[1]
            }
        })
    }

    async addElToArr (params) {
        const {Configuration} = this.ctx.model
        const result = await Configuration.update({type: 'Configuration'}, { $addToSet: params})
        return result
    }

    async removeElToArr (params) {
        const {Configuration} = this.ctx.model
        const result = await Configuration.update({type: 'Configuration'}, { $pull: params})
        return result
    }
}

module.exports = ConfigurationService
