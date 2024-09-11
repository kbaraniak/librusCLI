const Table = require("console-table-printer").Table;

class Grades {
  constructor(api, menu) {
    this.api = api;
    this.menu = menu;
  }

  async getGradesTable(debug = false) {
    console.clear();
    console.log("Loading Grades...");

    let pointGrades = false;
    let Grades = await this.api.getGrades();
    Grades = Grades ? Grades.Grades : []; // Ensure Grades is an array

    if (Grades.length === 0) {
      pointGrades = true;
      Grades = await this.api.getPointGrades();
      Grades = Grades ? Grades.Grades : []; // Ensure PointGrades is an array
    }

    const gradesTable = new Table({
      columns: [
        { name: "Grade", alignment: "center", color: "green" },
        { name: "Lesson", alignment: "center", color: "yellow" },
        { name: "Teacher", alignment: "center", color: "lime" },
        { name: "Add Date", alignment: "center", color: "cyan" },
      ],
    });

    try {
      for (const grade of Grades) {
        const lesson = await this.api.getSubjects(grade.Subject.Id);
        const teacher = await this.api.getUsers(grade.AddedBy.Id);

        let newGrade = grade.Grade;
        if (pointGrades) {
          const categoryGrade = grade.Category.Url;
          const categoryData = await this.api.getAPI(categoryGrade);
          newGrade = `${grade.Grade}/${categoryData.Category.ValueTo}`;
        }

        gradesTable.addRow({
          Grade: newGrade,
          Lesson: lesson.Subject.Short,
          Teacher: `${teacher.User.FirstName} ${teacher.User.LastName}`,
          "Add Date": grade.Date,
        });
      }
      gradesTable.printTable();
    } catch (error) {
      console.error("Error loading grades:", error);
    }

    if (debug) {
      console.log("Debug Data:", Grades);
    }

    this.menu.backtoMenu();
  }
}

module.exports = Grades;
