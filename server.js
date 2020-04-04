const { serveHTTP, publishToCentral } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

serveHTTP(addonInterface, { port: 3000 });

publishToCentral('https://onurdegerli-stremio-oscar-movies.glitch.me/manifest.json')