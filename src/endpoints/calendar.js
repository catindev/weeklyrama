const crypto = require('crypto')
const sliceDateRange = require('chunk-date-range')
const moment = require('moment')
moment.locale('ru')

function md5(string) {
    return crypto
        .createHash('md5')
        .update(string)
        .digest('hex');
}

function hf(od, eow = false, is5d = false) {
    const subtract = is5d ? 3 : 1
    return eow ?
        moment(od).subtract(subtract, 'd').format('D MMMM')
        :
        moment(od).format('D MMMM')
}

function splitCurrentDate() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth().toString().length > 1 ?
        (date.getMonth() + 1).toString()
        :
        `0${date.getMonth() + 1}`
    const day = date.getDate().toString().length > 1 ?
        date.getDate().toString()
        :
        `0${date.getDate()}`

    return { day, month, year }
}

function isCurrentWeek({ start, end }) {
    const c = new Date().getTime()
    start = new Date(start).getTime()
    end = new Date(end).getTime()
    return c > start && c < end
}

function isOverdue({ start, end }) {
    const c = new Date().getTime()
    start = new Date(start).getTime()
    end = new Date(end).getTime()
    return c > start && c > end
}

// moment(od).format('D MMMM')

// TODO:
// isCurrentWeek - для определения текущей недели
// isOverdue - для пропущенной недели

module.exports = (request, response) => {

    const cd = splitCurrentDate()
    let { query: { month, year } } = request
    if (!month) month = cd.month
    if (!year) year = cd.year

    // console.log(`${year}-${month}-${cd.day}`)

    const thedate = `${year}-${month}-${cd.day}`


    // Начало недели первого дня месяца
    const startOfMonth = moment(new Date(thedate)).startOf('month')
    // console.log(startOfMonth.startOf('week').format('D MMMM'))

    // Конец недели последнего дня месяца
    const endOfMonth = moment(new Date(thedate)).endOf('month')
    // console.log(endOfMonth.endOf('week').format('D MMMM'))

    /****************/

    const start = new Date(startOfMonth.startOf('week'))
    const end = new Date(endOfMonth.endOf('week'))
    const chunksType = 'week'

    console.log(start, end)

    const rama = sliceDateRange(start, end, chunksType).map((chunk, index) => ({
        name: `${hf(chunk.start)} - ${hf(moment(chunk.end).subtract(1, 'd'))}`,
        // start: chunk.start, end: chunk.end, // нахуа?
        current: isCurrentWeek({ start: chunk.start, end: chunk.end }),
        overdue: isOverdue({ start: chunk.start, end: chunk.end }),
        weekId: 'w' + md5(`${new Date(chunk.start).getTime()}${new Date(chunk.end).getTime()}`)
    }));

    // rama.splice(0, 1)

    response.json(rama)
}