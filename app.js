const { Table } = require("console-table-printer");
const fs = require("fs");
const var_dump = require("var_dump");

const Librus = require("./API/api");
const api = new Librus();

function welcome() {
  console.log("Librus CLI v0.4\n\n");
}

function checkConfig() {
  if (fs.existsSync("./config.js")) {
    let { login, pass } = require("./config");
    return { login, pass };
  } else {
    var configFile = fs.createWriteStream("./config.js");
    configFile.write(
      'var config= {\n\
    login: "login-synergia",\n\
    pass: "haslo-synergia"\n\
}\n\
\n\
module.exports = config'
    );
    configFile.end();
    console.log("No Found config file, creating default");
  }
}

async function getGradesTable(token) {
  const usrGrades = await api.getGrades(token).then((data) => {
    return data;
  });
  let gt;

  gt = new Table({
    columns: [
      { name: "Grade", alignment: "center", color: "green" }, //
      { name: "Lesson", alignment: "center", color: "yellow" },
      { name: "Teacher", alignment: "center", color: "lime" },
      { name: "Add Date", alignment: "center", color: "cyan" },
    ],
  });
  try {
    for (const usrGrade of usrGrades) {
      gt.addRow({
        Grade: usrGrade["Grade"],
        Lesson: usrGrade["Subject"],
        Teacher: usrGrade["Teacher"],
        "Add Date": usrGrade["Date"],
      });
    }
    gt.printTable();
  } catch (e) {
    console.error("Debugger Error Data [Grades API]:");
    var_dump(e);
    console.error("Debugger Error Data [Grades API - display Table]:");
    var_dump(usrGrades);
  }
}

async function getTimetables(token, nextWeek=false) {
  const Timetable = await api.getTimetable(token, nextWeek).then((data) => {
    return data;
  });
  let tt;
  for (var TimetableArray in Timetable) {
    let t1 = Timetable[TimetableArray];
    let td1 = null;
    if (t1.length > 0) {
      let Day = t1[0]["Day"]
      let weekday = new Date(Day).toLocaleString('en-us', {weekday:'long'});
      td1 = weekday + " (" + Day + ")";
    }
    tt = new Table({
      title: td1,
      columns: [
        { name: "Number", alignment: "center", color: "green" },
        { name: "Lesson", alignment: "center", color: "yellow" },
        { name: "Teacher", alignment: "center", color: "cyan" },
      ],
    });

    for (var TimetableDay in t1) {
      let TimetableLesson = t1[TimetableDay];
      let Number = TimetableLesson["Number"];
      let Time = TimetableLesson["Time"];
      let Name = TimetableLesson["Name"];
      let Teacher = TimetableLesson["Teacher"];

      tt.addRow({
        Number: Number + ". " + Time,
        Lesson: Name,
        Teacher: Teacher,
      });
    }
    if (t1.length > 0) {
      tt.printTable();
    }
  }
}
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
async function menu(token){
    console.log("Select option")
    console.log("1. Check grades")
    console.log("2. Check timetable [Default]")
    console.log("3. Check timetable [Next Week]")
    console.log("0. Changelog & Check latest version")

      readline.question('> ', async function(name) {
        if(name.length < 0 && isNaN(parseInt(name))){
            readline.close()
            console.log("")
            menu();
        }
        else if (name.length < 0){
            console.log("Selecting default option")
            await getTimetables(token);
        }
        else{
            readline.close()
            opt = parseInt(name)
            if (opt == 0){
                console.log("Version v0.4")
                console.log("> Update for Timetables")
                console.log("> Add menu options")
                console.log("> Add Changelog and check updates")
                console.log("--------------------------------------------------")
                console.log("Check latest version on:")
                console.log("https://github.com/kbaraniak/librusCLI/releases/latest")
                console.log('See you next time')
            }
            else if(opt == 1){
                await getGradesTable(token);
            }
            else if(opt == 2){
                await getTimetables(token);
            }
            else if(opt == 3){
                await getTimetables(token, nextWeek=true);
            }
            else{
                console.log("Selecting default option")
                await getTimetables(token);
            }
        }
      });      
}

welcome();
const { login, pass } = checkConfig();

api.authUsername(login, pass).then(async function (token) {
  if (token == "Bearer undefined") {
    console.error("Invalid Login or Password");
    console.error("Please edit default data on config.js");
    process.exit(1);
  } else {
    await menu(token);
  }
});
