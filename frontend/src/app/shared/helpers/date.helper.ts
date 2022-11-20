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
