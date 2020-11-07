const {filterConfig} = require('../../config/issues')
module.exports = function (issues,filterIssueList) {
    let match = false
    filterIssueList.forEach((item) => {
        var filterFn =  filterConfig[item.type].filter;
        var rule = item.value;
        if(filterFn(issues,rule)){
            match = true
        }
    })

    return match
}

