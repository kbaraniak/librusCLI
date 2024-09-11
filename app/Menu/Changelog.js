const strings = require("node-strings");

class Changelog {
  constructor(backtoMenu) {
    this.backtoMenu = backtoMenu;
    this.versions = [
      { version: "v2.0", changes: ["Changed file structure", "Updated to latest API", "Optimized code"] },
      { version: "v1.2", changes: ["Added Check Attendances", "Optimized Debug Feature", "Introduced Point Grades"] },
      { version: "v1.0", changes: ["Optimized CLI code", "Updated code for latest API", "Changed authentication method"] },
      { version: "v0.4", changes: ["Update for Timetables", "Added menu options", "Added Changelog and check updates"] }
    ];
  }

  displayMenu = async () => {
    console.clear();
    console.log(strings.bold(strings.underline("Changelog\n")));

    this.versions.forEach((version) => {
      console.log(strings.underline(`Version ${version.version}`));
      version.changes.forEach((change) => console.log(`> ${change}`));
    });

    console.log("--------------------------------------------------");
    console.log("Check the latest version on:");
    console.log("https://github.com/kbaraniak/librusCLI/releases/latest");
    console.log("See you next time!");

    this.backtoMenu();
  };
}

module.exports = Changelog;
