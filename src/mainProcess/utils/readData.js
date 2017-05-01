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
const dateMatcher = new RegExp(
    `(${matchMonthStr}) (${matchDayStr}), (${matchYearStr}) (${matchHoursStr}):(${matchMinutesStr})`
);
const entryMatcher = new RegExp(`^(${matchWeightStr}); (${matchDateTimeStr});(${matchCommentStr})$`);

function convertDate(str) {

    const [, , monthStr, dayStr, yearStr, hStr, minStr] = str.match(dateMatcher);
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

function convertEntries(entries) {
    return entries.map(entry => {
        const matches = entry.match(entryMatcher);
        if (!matches) {
            throw new Error(`Invalid entry “${entry}”`);
        }
        const [, weight, date, comment] = matches;
        return {
            weight: convertWeight(weight),
            date: convertDate(date),
            comment: comment.length > 0 ? comment : null
        };
    });
}

module.exports = (path) => {
    const text = fs.readFileSync(path, { encoding: 'utf8' }).trim();

    if (text.length === 0) {
        console.error(`No contents found in input file “${path}”`);
        return null;
    }

    const lines = text.split('\n');

    if (lines.length < 4) {
        console.error(`less than 4 lines in input file ${path}`);
        return null;
    }

    const [header1, header2, , ...entries] = lines;

    if (!header1.startsWith('Startgewicht:') || !header2.startsWith('Zielgewicht:')) {
        console.error(`No header lines found in input file “${path}”`);
        return null;
    }

    try {
        return convertEntries(entries);
    } catch (error) {
        console.error(`Error reading input file “${path}”: ${error.message}`);
        return null;
    }
};

