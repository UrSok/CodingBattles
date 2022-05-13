export function addMinutesToDate(date, minutes) {
  return new Date(new Date(date).setMinutes(new Date(date).getMinutes() + minutes));
}