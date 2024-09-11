// config.js
const fs = require("fs");
const path = require("path");
const Menu = require("../Menu/Menu");
const readline = require("readline");

class Config {
  constructor(api) {
    this.api = api;
    this.menu = new Menu(api);
  }

  async checkConfig() {
    if (fs.existsSync("./config.json")) {
      try {
        const { login, pass, debug } = require(path.join(process.cwd(), "config.json"));
        await this.getToken(login, pass, debug);  // Ensure async call is awaited
        return debug;
      } catch (e) {
        console.error("[LibrusCLI] Invalid config file. Delete it and rerun the program.");
        process.exit(1);
      }
    } else {
      await this.createConfig(); // Ensure async call is awaited
    }
  }

  async createConfig() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (text) => new Promise(resolve => rl.question(text, resolve));

    const login = await question("Login: ");
    const pass = await question("Password: ");
    rl.close();

    const config = { login, pass, debug: undefined };
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
    
    console.log("[LibrusCLI] Created new config, loading menu...");
    await this.getToken(login, pass); // Ensure async call is awaited
  }

  async getToken(login, pass, debug) {
    try {
      const result = await this.api.mkToken(login, pass);
      if (result.status === 'error') {
        console.error("[LibrusCLI] Invalid Login or Password.");
        process.exit(1);
      }
      console.log("[LibrusCLI] User authenticated. Loading menu...");
      this.menu.showMenu(debug);
    } catch (error) {
      console.error("[LibrusCLI] Authentication failed.", error);
    }
  }

  static getVersion(){
    return "2.0";
  }
}

module.exports = Config;
