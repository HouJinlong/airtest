
const Controller = require('egg').Controller

class ViewController extends Controller {
    async index () {
        await this.ctx.render('index.tpl')
    }
}

module.exports = ViewController
