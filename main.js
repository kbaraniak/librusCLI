const { LibrusAPI } = require("./api/api");
const Config = require("./app/Config/Config");

const api = new LibrusAPI();
const config = new Config(api);

config.checkConfig();
