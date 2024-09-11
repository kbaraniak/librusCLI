const Grades = require("./Modules/Grades/Grades");
const Attendances = require("./Modules/Attendances/Attendances");
const Timetable = require("./Modules/Timetable/Timetable");
const Calendar = require("./Modules/Calendar/Calendar");

class Modules {
  constructor(api, menu) {
    this.api = api;
    this.menu = menu;
    this.grades = new Grades(api, menu);
    this.attendaces = new Attendances(api, menu);
    this.timetable = new Timetable(api, menu);
    this.calendar = new Calendar(api, menu)
  }
}

module.exports = Modules;
