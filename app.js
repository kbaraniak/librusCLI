const { Table } = require("console-table-printer");
const Librus = require('./API/api')

const { login, pass } = require("./config");

const api = new Librus();

function welcome(){
    console.log("Librus CLI v0.2\n\n")
    console.log("Loading Default Option - Available Grades Table")
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
}

welcome();

api.authUsername(login, pass).then(async function (token) {
    if(token == "Bearer undefined"){
        console.error("Invalid Login or Password")
        console.error("Please edit default data on config.js")
    }
    else{
        await getGradesTable(token);
    }

});





