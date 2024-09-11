const Table = require("console-table-printer").Table;

class Calendar {
  constructor(api, menu) {
    this.api = api;
    this.menu = menu;
  }

  async getCalendar(debug) {
    console.clear();
    console.log("Loading Events ...")
    const Events = await this.api.getHomeWorks().then(async (data) => {
      return data.HomeWorks
    });
    let eventsTable = new Table({
      title: 'Class Events',
      columns: [
        { name: "Name", alignment: "center", color: "green" },
        { name: "Date", alignment: "center", color: "yellow" },
        { name: "Category", alignment: "center", color: "cyan" },
        { name: "Teacher", alignment: "center", color: "red" },
        { name: "Time", alignment: "center", color: "white" },
      ],
    });
    for (const event of Events) {
      let eventName = event.Content.slice(0, 24)
      let eventDate = event.Date
      let eventTime = event.TimeFrom + " - " + event.TimeTo
      const eventCategoryId = event.Category.Id
      const eventTeacherId = event.CreatedBy.Id
      let eventTeacher = await this.api.getUsers(eventTeacherId).then((data) => {
        return data.User.FirstName + " " + data.User.LastName
      });
      let eventCategory = await this.api.getHomeWorksCategories(eventCategoryId).then((data) => {
        return data.Category.Name
      });
      eventsTable.addRow({
        Name: eventName,
        Date: eventDate,
        Category: eventCategory,
        Teacher: eventTeacher,
        "Time": eventTime
      })
    }
    eventsTable.printTable();
    // if (debug) {
    //   __debugData(Events)
    // }

    this.menu.backtoMenu();
  }

}

module.exports = Calendar;