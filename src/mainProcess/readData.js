const fs = require('fs');

const monthNames = [
    'Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'
];

const matchWeightStr = '[1-9][0-9]{1,2},[0-9]';
const matchMonthStr = `(${monthNames.map(curr => curr.replace('.', '\.')).join('|')})`;
const matchDayStr = '[0-9]{1,2}';
const matchYearStr = '[0-9]{4}';
const matchHoursStr = '[0-9]{2}';
const matchMinutesStr = '[0-9]{2}';
const matchDateStr = `${matchMonthStr} ${matchDayStr}, ${matchYearStr}`;
const matchTimeStr = `${matchHoursStr}:${matchMinutesStr}`;
const matchDateTimeStr = `${matchDateStr} ${matchTimeStr}`;
const matchCommentStr = '[^0-9]*';

function convertDate(str) {
    const dateMatcher = new RegExp(
        `(${matchMonthStr}) (${matchDayStr}), (${matchYearStr}) (${matchHoursStr}):(${matchMinutesStr})`
    );

    const [ , , monthStr, dayStr, yearStr, hStr, minStr ] = str.match(dateMatcher);
    const month = monthNames.indexOf(monthStr);
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);
    const h = parseInt(hStr, 10);
    const min = parseInt(minStr, 10);
    return new Date(year, month, day, h, min);
}

function convertWeight(str) {
    return parseFloat(str.replace(',', '.'));
}

module.exports = (path) => {
    const entryMatcher = new RegExp(`${matchWeightStr}; ${matchDateTimeStr};${matchCommentStr}`, 'g');

    const text = fs.readFileSync(path, { encoding: 'utf8' }).trim();

    const weightMatcher = new RegExp(`^${matchWeightStr}`);
    const dateMatcher = new RegExp(matchDateTimeStr);
    const commentMatcher = new RegExp(`;(${matchCommentStr})$`);
    return text.match(entryMatcher).map(entryStr => {
        const commentStr = entryStr.match(commentMatcher)[1].trim();
        const weightStr = entryStr.match(weightMatcher)[0];
        const dateStr = entryStr.match(dateMatcher)[0];
        convertDate(dateStr);
        return {
            weight: convertWeight(weightStr),
            date: convertDate(dateStr),
            comment: commentStr.length > 0 ? commentStr : null
        };
    });
};

