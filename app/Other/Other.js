class Other {
    displayBanner() {
        console.log(`Librus CLI ${appVersion}`);
    }

    removeEmptyElements(obj) {
        const newObj = {};
        for (const key in obj) {
            if (!(typeof obj[key] === "object" && !Object.keys(obj[key]).length)) {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    }

    fixURL(url) {
        return url.replaceAll("https://api.librus.pl/2.0/", "");
    }
}

module.exports = Other;