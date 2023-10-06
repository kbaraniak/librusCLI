const { Table } = require("console-table-printer");
const fs = require("fs");
const var_dump = require("var_dump");
const strikeText = require("./external/strike");
const strings = require('node-strings');

const { LibrusAPI } = require("./api/api");
const api = new LibrusAPI();

function welcome() {
  console.log("Librus CLI v1.0 Beta 1\n\n");
  console.log("");
}

function checkConfig() {
  if (fs.existsSync("./config.js")) {
    try {
      let { login, pass } = require("./config");
      return { login, pass };
    } catch {
      console.log(
        "[LibrusCLI] Invalid config file, please delete and rerun program"
      );
      process.exit(1);
    }
  } else {
    var configFile = fs.createWriteStream("./config.js");
    configFile.write(
      'var config= {\nlogin: "login-synergia",\npass: "password-synergia"\n}\n\nmodule.exports = config'
    );
    configFile.end();
    console.log("[LibrusCLI] No Found config file, creating new config");
    console.log(
      "[LibrusCLI] Created new config, please fill with your data and restart program"
    );
    return false;
  }
}

function removeEmptyElements(obj) {
  const newObj = {};
  for (const key in obj) {
    if (!(typeof obj[key] === "object" && !Object.keys(obj[key]).length)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

function fixURL(url){
  return url.replaceAll("https://api.librus.pl/2.0/", "");
}

async function getGradesTable() {
  console.log("Loading Grades ...")
  const Grades = await api.getGrades().then((data) => {
    return data.Grades;
  });
  let gradesTable = new Table({
    columns: [
      { name: "Grade", alignment: "center", color: "green" }, //
      { name: "Lesson", alignment: "center", color: "yellow" },
      { name: "Teacher", alignment: "center", color: "lime" },
      { name: "Add Date", alignment: "center", color: "cyan" },
    ],
  });
  try {
    for (const grade of Grades) {
      const lessonGrade = await api.getSubjects(grade["Subject"].Id).then((data) => {
        return data.Subject;
      });
      const authorGrade = await api.getUsers(grade["AddedBy"].Id).then((data) => {
        return data.User;
      });
      gradesTable.addRow({
        Grade: grade["Grade"],
        Lesson: lessonGrade["Short"],
        Teacher: authorGrade["FirstName"] + " "  + authorGrade["LastName"],
        "Add Date": grade["Date"],
      });
    }
    gradesTable.printTable();
  } catch (e) {
    console.error("Debugger Error Data [Grades API]:");
    var_dump(e);
    console.error("Debugger Error Data [Grades API - display Table]:");
    var_dump(Grades);
  }
}


async function getTimetables(oneDay=false, week="") {
  const Timetable = await api.getTimetables().then(async (data) => {
    // console.log(data)
    if(week == "next"){
      let nextTimetable = await api.getAPI(fixURL(data.Pages.Next)).then((data) => {
        return data.Timetable;
      });
      return nextTimetable;
    }
    else if(week == "prev"){
      let prevTimetable = await api.getAPI(fixURL(data.Pages.Prev)).then((data) => {
        return data.Timetable;
      });
      return prevTimetable;
    }
    else{
      return data.Timetable;
    }
  });
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timetable = {};
  let day = 0;

  for (const x in Timetable) {
    let tableTimetables = new Table({
      title: `Day ${day + 1} (${days[day]})`,
      columns: [
        { name: "Number", alignment: "center", color: "green" },
        { name: "Lesson", alignment: "center", color: "yellow" },
        { name: "Teacher", alignment: "center", color: "cyan" },
      ],
    });
    const elm = Timetable[x];
    timetable[days[day]] = [];

    for (const i of elm) {
      if (i) {
        const filteredData = removeEmptyElements(i);
        if (Object.keys(filteredData).length > 0) {
          if(!oneDay){
            let Time = filteredData[0].HourFrom + " - " + filteredData[0].HourTo;
            let LessonName = filteredData[0].Subject.Short;
            if (filteredData[0].IsCanceled) {
              LessonName = strikeText(LessonName) + " (Canceled)";
            }
            tableTimetables.addRow({
              Number: filteredData[0].LessonNo + ". " + Time,
              Lesson: LessonName,
              Teacher:
                filteredData[0].Teacher.FirstName +
                " " +
                filteredData[0].Teacher.LastName,
            });
          }
          else{
            const getTodayNumber = () => {
              const today = new Date();
              const dayOfWeek = today.getDay();
            
              // Monday is 1, Sunday is 0
              return Number(dayOfWeek);
            };
            function printData(filteredData){
              let Time = filteredData[0].HourFrom + " - " + filteredData[0].HourTo;
              let LessonName = filteredData[0].Subject.Short
              if (filteredData[0].IsCanceled) {
                LessonName = strikeText(LessonName) + " (Canceled)";
              }
              tableTimetables.addRow({
                Number: filteredData[0].LessonNo + ". " + Time,
                Lesson: LessonName,
                Teacher:
                  filteredData[0].Teacher.FirstName +
                  " " +
                  filteredData[0].Teacher.LastName,
              });
            }
            const dayNumber = getTodayNumber();
            if(oneDay == "Today" && filteredData[0].DayNo == dayNumber){
              printData(filteredData)
            }
            else if(oneDay == "Tomorrow" && filteredData[0].DayNo == dayNumber+1){
              printData(filteredData)
            }
          }
        }
      }
    }
    if (tableTimetables.table.rows.length > 0) {
      tableTimetables.printTable();
    }

    if (!timetable[days[day]].length) {
      delete timetable[days[day]];
    }

    day++;
  }
}

function aboutChangelog(){
    console.log("")
    console.log(strings.bold(strings.underline("Changelog\n")))
    console.log(strings.underline("Version v1.1"));
    console.log("> Optimized CLI code");
    console.log("> Updated code for latest API");
    console.log("> Changed authentication method");
    console.log(strings.underline("Version v0.4"));
    console.log("> Update for Timetables");
    console.log("> Add menu options");
    console.log("> Add Changelog and check updates");
    console.log("--------------------------------------------------");
    console.log("Check latest version on:");
    console.log("https://github.com/kbaraniak/librusCLI/releases/latest");
    console.log("See you on the next time");
}
function aboutAuthor(){
  console.log(strings.underline("\nAbout Author:"));
  console.log("Author: Kamil Baraniak");
  console.log("Github: https://github.com/kbaraniak");
  console.log("[LibrusCLI v1.1] - Thank you for usage");
}

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
async function menu(token) {
  console.log(strings.bold("Select option\n"));
  console.log(strings.underline("Grades:"));
  console.log("- 1. Show grades\n");
  console.log(strings.underline("Timetables:"));
  console.log("- 2. Show timetable");
  console.log("- 3. Show timetable for next week");
  console.log("- 4. Show timetable for prev week");
  console.log("- 5. Show timetable only for Today");
  console.log("- 6. Show timetable only for Tomorrow\n");
  console.log(strings.underline("About:"));
  console.log("- 0. Changelog");
  console.log("- A. Author");

  readline.question("> ", async function (arg) {
    if ((arg.length < 0 && isNaN(parseInt(arg)))) {
      readline.close();
      console.log("");
      menu();
    } else if (arg.length < 0) {
      console.log("Selected default option");
      await getTimetables();
    } else {
      readline.close();
      opt = parseInt(arg) || arg;
      if (opt == 0) {
        aboutChangelog();
      } else if (opt == 1) {
        await getGradesTable();
      } else if (opt == 2) {
        await getTimetables();
      } else if (opt == 3) {
        await getTimetables(oneDay=false, week="next");
      } else if (opt == 4) {
        await getTimetables(oneDay="Today")
      } else if (opt == 5) {
        await getTimetables(oneDay="Tomorrow")
      } else if (arg == "A" || arg == "a"){
        aboutAuthor();
      } else {
        console.log("Selected default option");
        await getTimetables();
      }
    }
  });
}

/* Main Function */
welcome();
let { login, pass } = checkConfig();
api.mkToken(login, pass).then((r) => {
  if (r.status == "error") {
    console.error("[LibrusCLI] Invalid Login or Password");
    console.error(
      "[LibrusCLI] Please check for correct login/password in config.js"
    );
    process.exit(1);
  }
  menu()
});
