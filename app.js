const { Table } = require("console-table-printer");
const fs = require("fs");
const var_dump = require("var_dump");
let login, pass;

const Librus = require('./API/api')
const api = new Librus();

function welcome(){
    console.log("Librus CLI v0.2\n\n")
    console.log("Loading Default Option - Available Grades Table")
}

function checkConfig(){
    if (fs.existsSync("./config.js")) {
        let { login, pass } = require("./config");
    }
    else{
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
        console.log("No Found config file, creating default")
    }
}

async function getGradesTable(token){
    const usrGrades = await api.getGrades(token).then(data => { return data });
    let vp

    vp = new Table({
        columns: [
          { name: "Grade", alignment: "center", color: "green" }, //
          { name: "Lesson", alignment: "center", color: "yellow" },
          { name: "Teacher", alignment: "center", color: "lime" },
          { name: "Add Date", alignment: "center", color: "cyan" },
        ],
    });
    try{
        for (const usrGrade of usrGrades){
            vp.addRow(
                { 
                    Grade: usrGrade["Grade"], 
                    Lesson: usrGrade["Subject"], 
                    Teacher: usrGrade["Teacher"], 
                    "Add Date": usrGrade["Date"],
                }
            );
        }
        vp.printTable()
    }catch(e){
        var_dump(e);
        console.error("Debugger Error Data [Grades API - display Table]:")
        var_dump(usrGrades);
    }
}

welcome();
checkConfig();

api.authUsername(login, pass).then(async function (token) {
    if(token == "Bearer undefined"){
        console.error("Invalid Login or Password")
        console.error("Please edit default data on config.js")
    }
    else{
        await getGradesTable(token);
    }

});





