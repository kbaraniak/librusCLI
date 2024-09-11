const Table = require("console-table-printer").Table;

class Attendances {
  constructor(api, menu) {
    this.api = api;
    this.menu = menu;
  }

  async getAttendances(debug = false) {
    console.clear();
    console.log("Loading Attendances...");

    const [attendanceData, typesData] = await Promise.all([
      this.api.getAttendances(),
      this.api.getAttendancesTypes(),
    ]);
    const Attendances = attendanceData?.Attendances || [];
    const Types = typesData?.Types || [];

    const typeMap = Types.reduce((map, type) => {
      map[type.Id] = type.Name;
      return map;
    }, {});

    const attendancesTable = new Table({
      columns: [
        { name: "Date", alignment: "center", color: "green" },
        { name: "Lesson Nr", alignment: "center", color: "yellow" },
        { name: "Type", alignment: "center", color: "red" },
        { name: "Teacher", alignment: "center", color: "cyan" },
      ],
    });

    const teacherIDs = Attendances.filter(event => event.Type.Id !== 100).map(event => event.AddedBy.Id);
    const teacherData = await Promise.all(teacherIDs.map(id => this.api.getUsers(id)));
    const teacherMap = teacherData.reduce((map, data) => {
      map[data.User.Id] = `${data.User.FirstName} ${data.User.LastName}`;
      return map;
    }, {});
    
    for (const event of Attendances) {
      if (event.Type.Id !== 100) {
        const lessonNum = event.LessonNo;
        const eventDate = event.Date;
        const eventType = typeMap[event.Type.Id] || "Unknown Type";
        const teacherName = teacherMap[event.AddedBy.Id] || "Unknown Teacher";

        attendancesTable.addRow({
          Date: eventDate,
          "Lesson Nr": lessonNum,
          Type: eventType,
          Teacher: teacherName,
        });
      }
    }

    attendancesTable.printTable();

    if (debug) {
      console.log("Debug Data:", Attendances);
    }

    this.menu.backtoMenu();
  }
}

module.exports = Attendances;
