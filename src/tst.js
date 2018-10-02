
function getWeeksStartAndEndInMonth(month, year) {
    let weeks = [],
        firstDate = new Date(year, month, 1),
        lastDate = new Date(year, month + 1, 0),
        numDays = lastDate.getDate();

    let start = 1;
    // let end = 7 - firstDate.getDay();
    let end = firstDate.getDay() === 0 ? 1 : 7 - firstDate.getDay() + 1;

    while (start <= numDays) {
        weeks.push({ start: start, end: end });
        start = end + 1;
        end = end + 7;
        end = start === 1 && end === 8 ? 1 : end;
        end > numDays && (end = numDays);
    }
    return weeks;
}


const t = new Date();
console.log(getWeeksStartAndEndInMonth(t.getMonth(), t.getFullYear()))