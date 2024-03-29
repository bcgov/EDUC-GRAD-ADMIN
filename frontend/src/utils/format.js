import {
  DateTimeFormatterBuilder,
  LocalDate,
  LocalDateTime,
  ResolverStyle,
} from "@js-joda/core";

export function getDateFormatter(pattern) {
  return new DateTimeFormatterBuilder()
    .appendPattern(pattern)
    .toFormatter(ResolverStyle.STRICT);
}

export function formatDateTime(
  datetime,
  from = "uuuuMMdd",
  to = "uuuu/MM/dd",
  hasTimePart = false
) {
  const fromFormatter = getDateFormatter(from);
  const toFormatter = getDateFormatter(to);
  let result = datetime;
  const localDateTime = hasTimePart ? LocalDateTime : LocalDate;
  if (datetime && datetime.length > 0) {
    try {
      const date = localDateTime.parse(datetime, fromFormatter);
      result = date.format(toFormatter);
    } catch (err) {
      console.info(
        `could not parse date ${datetime}: ${from} to ${to} as date provided is invalid`
      );
    }
  }
  return result;
}
export function dateFormatYYYYMM(value) {
  return value.replace(/^([\d]{4})([\d]{2})$/, "$1-$2");
}

export function dateFormatYYYYMMDD(value) {
  return value.replace(/^([\d]{4})([\d]{2})([\d]{2})$/, "$1-$2-$3");
}
export function formatMincode(mincode) {
  return mincode;
}

export function formatDob(dob, from = "uuuuMMdd", to = "uuuu/MM/dd") {
  return formatDateTime(dob, from, to);
}
