const strings = require("node-strings");
const Modules = require("../ListModules");
const Changelog = require("./Changelog");
const Author = require("./Author");
const readline = require("readline");
const packageInfo = require('../../package.json');

class Menu {
  constructor(api) {
    this.api = api;
    this.appVersion = packageInfo.version
    this.modules = new Modules(api, this); // Pass the Menu instance
    this.changelog = new Changelog(this.backtoMenu.bind(this)); // Ensure binding
    this.author = new Author(this.backtoMenu.bind(this))
    this.grades = this.modules.grades;
    this.attendaces = this.modules.attendaces;
    this.timetable = this.modules.timetable;
    this.calendar = this.modules.calendar;
  }

  async showMenu(debug) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.log(strings.bold("Select option\n"));
    console.log(strings.underline("Student:"));
    console.log("- 1. Show grades");
    console.log("- 2. Show attendances\n");
    console.log(strings.underline("Timetables:"));
    console.log("- 3. Show timetable");
    console.log("- 4. Show timetable for next week");
    console.log("- 5. Show timetable for prev week");
    console.log("- 6. Show timetable only for Today");
    console.log("- 7. Show timetable only for Tomorrow\n");
    console.log(strings.underline("Calendar:"));
    console.log("- 8. Show events\n");
    console.log(strings.underline("About:"));
    console.log("- C. Changelog");
    console.log("- A. Author");
    console.log("- X. Exit App");

    rl.question("Select > ", async (arg) => {
      rl.close();
      const option = parseInt(arg) || arg;

      switch (option) {
        case 0:
          this.changelog.displayMenu();
          break;
        case 1:
          await this.grades.getGradesTable(debug);
          break;
        case 2:
          await this.attendaces.getAttendances();
          break;
        case 3:
          await this.timetable.getTimetables();
          break;
        case 4:
          await this.timetable.getTimetables("next");
          break;
        case 5:
          await this.timetable.getTimetables("prev");
          break;
        case 6:
          await this.timetable.getTimetables("","Today");
          break;
        case 7:
          await this.timetable.getTimetables("","Tomorrow");
          break;
        case 8:
          await this.calendar.getCalendar();
          break;
        case 'C':
        case 'c':
          this.changelog.displayMenu();
          break;
        case 'A':
        case 'a':
          this.author.displayMenu();
          break;
        case 'X':
        case 'x':
          console.clear();
          console.log(strings.bold(`Librus CLI ${this.appVersion}`));
          console.log("Goodbye");
          process.exit(0);
          break;
        default:
          console.log("Invalid option");
          this.showMenu(debug);
      }
    });
  }

  backtoMenu() {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("\n0. Exit");
    console.log("Other key - Back to Menu");
    readline.question("> ", (arg) => {
      readline.close();
      if (arg === '0') {
        process.exit(0);
      } else {
        console.clear();
        this.showMenu();
      }
    });
  }
}

module.exports = Menu;
