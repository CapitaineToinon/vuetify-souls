const moment = require("moment");

export default {
  formatTime: value => {
    const ms = value.toString().split(".").length > 1;
    const time = moment.duration(value, "seconds");
    const format = `${time.hours() > 0 ? "H:" : ""}mm:ss${ms ? ".SSS" : ""}`;
    return value > 0 ? moment.utc(value * 1000).format(format) : "-";
  },
  formatDate: value => {
    return moment(value, "YYYY-MM-DD").fromNow();
  },
  ordinal: i => {
    const j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }
};
