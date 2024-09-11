const strings = require("node-strings");
const packageInfo = require('../../package.json');

class Author {
    constructor(backtoMenu) {
        this.backtoMenu = backtoMenu;
        this.appVersion = packageInfo.version
    }
    displayMenu() {
        console.clear();
        console.log(strings.underline("\nAbout Author:"));
        console.log("Author: Kamil Baraniak");
        console.log("Github: https://github.com/kbaraniak");
        console.log(`[LibrusCLI ${this.appVersion}] - Thank you for usage`);

        this.backtoMenu();
    }
}

module.exports = Author;