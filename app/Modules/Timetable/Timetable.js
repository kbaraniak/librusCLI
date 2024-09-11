const Table = require("console-table-printer").Table;
const strikeText = require("striketext");

class Timetable {
  constructor(api, menu) {
    this.api = api;
    this.menu = menu;
    this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  }

  removeEmptyElements(obj) {
    const newObj = {};
    for (const key in obj) {
      if (!(typeof obj[key] === "object" && !Object.keys(obj[key]).length)) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  safeReplaceAll(str, search, replacement) {
    if (typeof str === 'string') {
      return str.replaceAll(search, replacement);
    }
    console.warn('Expected a string but received:', str);
    return str;
  }

  fixURL(url) {
    return this.safeReplaceAll(url, "https://api.librus.pl/2.0", "");
  }

  async fetchTimetable(week) {
    let timetableData;

    const timetableAPI = await this.api.getTimetables();
    if (week === "next") {
      timetableData = await this.api.getAPI(this.fixURL(timetableAPI.Pages.Next));
    } else if (week === "prev") {
      timetableData = await this.api.getAPI(this.fixURL(timetableAPI.Pages.Prev));
    } else {
      timetableData = timetableAPI;
    }

    return timetableData.Timetable;
  }

  async getTimetables(week, oneDay, debug) {
    console.clear();
    console.log("Loading Timetable...");

    try {
      const Timetable = await this.fetchTimetable(week);
      const timetable = {};
      let day = 0;

      for (const x in Timetable) {
        let tableTimetables = new Table({
          title: `Day ${day + 1} (${this.days[day]})`,
          columns: [
            { name: "Number", alignment: "center", color: "green" },
            { name: "Lesson", alignment: "center", color: "yellow" },
            { name: "Teacher", alignment: "center", color: "cyan" },
          ],
        });

        const elm = Timetable[x];
        timetable[this.days[day]] = [];

        for (const i of elm) {
          if (i) {
            const filteredData = this.removeEmptyElements(i);
            if (Object.keys(filteredData).length > 0) {
              const printData = (data) => {
                const Time = `${data[0].HourFrom} - ${data[0].HourTo}`;
                let LessonName = data[0].Subject.Short;
                if (data[0].IsCanceled) {
                  LessonName = strikeText(LessonName) + " (Canceled)";
                }
                tableTimetables.addRow({
                  Number: `${data[0].LessonNo}. ${Time}`,
                  Lesson: LessonName,
                  Teacher: `${data[0].Teacher.FirstName} ${data[0].Teacher.LastName}`,
                });
              };

              if (!oneDay) {
                printData(filteredData);
              } else {
                const getTodayNumber = () => {
                  const today = new Date().getDay();
                  return today === 0 ? 7 : today; // Adjust so that Monday is 1 and Sunday is 7
                };
                const dayNumber = getTodayNumber();

                if(oneDay === "Today" && filteredData[0].DayNo == dayNumber){
                  printData(filteredData);
                } else if(oneDay === "Tomorrow" && filteredData[0].DayNo == dayNumber+1){
                  printData(filteredData);
                } 
              }
            }
          }
        }

        if (tableTimetables.table.rows.length > 0) {
          tableTimetables.printTable();
        }

        if (!timetable[this.days[day]].length) {
          delete timetable[this.days[day]];
        }

        day++;
      }

      if (debug) {
        // __debugData(Timetable);
      }

      this.menu.backtoMenu();
    } catch (error) {
      console.error('Error in getTimetables:', error);
    }
  }
}

module.exports = Timetable;
