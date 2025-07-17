import dayjs, { Dayjs } from "dayjs";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(calendar);

const FAR_AWAY_DATE_FORMAT = "MMM D, YYYY";
const DATE_FORMAT = "MMM D";

const TIME_FORMAT = "HH:mm";

export function getFormattedDateLong(date: Date | Dayjs) {
    const dayjsdate = dayjs(date);
    const today = dayjs();

    if (dayjsdate.year() !== today.year()) {
        return dayjsdate.format(FAR_AWAY_DATE_FORMAT);
    }

    return dayjs().calendar(dayjs(date), {
        sameDay: `[Today], ${TIME_FORMAT}`,
        nextDay: `[Tomorrow], ${TIME_FORMAT}`,
        nextWeek: `${DATE_FORMAT}, ${TIME_FORMAT}`,
        lastDay: `[Yesterday], ${TIME_FORMAT}`,
        lastWeek: `${DATE_FORMAT}, ${TIME_FORMAT}`,
        sameElse: `${DATE_FORMAT}, ${TIME_FORMAT}`,
    });
}

export function getFormattedTime(date: Date | Dayjs): string {
    return dayjs(date).format(`${TIME_FORMAT}`);
}

export function getFormattedDay(date: Date | Dayjs): string {
    const dayjsdate = dayjs(date);
    const today = dayjs();

    if (dayjsdate.year() !== today.year()) {
        return dayjsdate.format(FAR_AWAY_DATE_FORMAT);
    }

    return dayjs().calendar(dayjsdate, {
        sameDay: `[Today]`,
        nextDay: `[Tomorrow]`,
        nextWeek: `${DATE_FORMAT}`,
        lastDay: `[Yesterday]`,
        lastWeek: `${DATE_FORMAT}`,
        sameElse: DATE_FORMAT,
    });
}
