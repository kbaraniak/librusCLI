# Librus CLI

## Screenshoots
Main Window

![Main Window](https://github.com/kbaraniak/librusCLI/assets/90936580/533a708a-319f-4fcf-8e48-e9f011bc7fcc)

Timetables

![image](https://github.com/kbaraniak/librusCLI/assets/90936580/12253ce7-5d32-4cde-a695-83e78c4d41af)

Grades

![image](https://github.com/kbaraniak/librusCLI/assets/90936580/0a75013a-b009-4a5f-a6aa-2f60a792dfe7)





## Requirements
> nodejs - version supports Axios

*If you want to download, it is recommended to use stable [Latest Release](https://github.com/kbaraniak/librusCLI/releases/latest)*


## Required modules
- [1 Method] in terminal use: ``npm i``
- [2 Method] install all required packages:
``npm i axios axios-cookiejar-support node-strings tough-cookie``

## Run this program
- Open terminal/console on directory downloaded file
   Type command: ``node app.js``

## Example Config
- Config is generated automatically, if you have a problem, copy below text to the **config.js** file

    ```js
    var config = {
        login: "synergia-login",
        pass: "synergia-password",
    };
    module.exports = config;
    ```

## Sources
API: [librus-api-rewrited](https://github.com/kbaraniak/librus-api-rewrited) [MIT License]
