const express = require('express');
const app = express();
const { format, startOfMonth, startOfWeek, endOfWeek, getWeeksInMonth, addWeeks, subDays } = require('date-fns');
const { ru } = require('date-fns/locale');

const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

function validateDate(dateString) {
  const datePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;

  if (!datePattern.test(dateString)) {
    return { error: "Дата должна быть в формате DD.MM.YYYY" };
  }

  const [_, day, month, year] = dateString.match(datePattern);
  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== parseInt(year) ||
    parsedDate.getMonth() !== parseInt(month) - 1 ||
    parsedDate.getDate() !== parseInt(day)
  ) {
    return { error: "Неверный формат даты" };
  }

  return { error: false };
}

function formatDate(inputDate) {
  const parsedDate = inputDate.split('.').reverse().join('-');
  const date = new Date(parsedDate);

  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  const monthName = monthNames[date.getMonth()];
  const formattedToday = format(today, 'dd MMMM yyyy', { locale: ru });

  const weeksInMonth = getWeeksInMonth(date, { weekStartsOn: 1 });
  const weeks = [];

  const firstMonday = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });

  for (let i = 0; i < weeksInMonth; i++) {
    const weekStartDate = addWeeks(firstMonday, i);
    const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 1 });

    let weekStatus;
    if (weekEndDate < currentWeekStart) {
      weekStatus = 'past';
    } else if (weekStartDate <= currentWeekStart && weekEndDate >= currentWeekStart) {
      weekStatus = 'current';
    } else {
      weekStatus = 'future';
    }

    weeks.push({
      monday: format(weekStartDate, 'dd MMMM', { locale: ru }),
      sunday: format(weekEndDate, 'dd MMMM', { locale: ru }),
      status: weekStatus
    });
  }

  return {
    monthName,
    formattedToday,
    weeks,
  };
}


app.get('/', (req, res) => {
  const inputDate = req.query.date || format(new Date(), 'dd.MM.yyyy');
  const validationResult = validateDate(inputDate);

  if (validationResult.error) {
    res.status(400).json({ error: validationResult.error });
  } else {
    const result = formatDate(inputDate);
    res.json(result);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
