export function setDateToMidnight(date?: Date | null) {
   if (date == null) return date;

   const copy = new Date(date);
   const tzOffset = copy.getTimezoneOffset();

   if (tzOffset > 0) {
      copy.setUTCHours(0, 0, 0, 0);
   } else {
      copy.setUTCHours(24, 0, 0, 0);
   }

   return copy;
}

const MS_PER_DAY = 86_400_000;

/**
 * @param date is a yyyy-MM-dd formated date string
 * @returns difference between date and current date in days (positive
 * if current date is passed date, and negative backwards)
 */
export function diffInDaysFromNow(date: string) {
   const nowWithTz = new Date();
   const now = Date.UTC(
      nowWithTz.getFullYear(),
      nowWithTz.getMonth(),
      nowWithTz.getDate(),
   );

   const [year, month, day] = date.split('-').map(str => +str);
   // month is zero based
   const currentDate = Date.UTC(year, month - 1, day);

   return Math.floor((now - currentDate) / MS_PER_DAY);
}
