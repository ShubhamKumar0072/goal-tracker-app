function toUTCStartOfDay(localDate) {
  return new Date(Date.UTC(
    localDate.getFullYear(),
    localDate.getMonth(),
    localDate.getDate()
  ));
}

module.exports = toUTCStartOfDay;