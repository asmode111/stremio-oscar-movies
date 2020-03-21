const axios = require("axios");
const fs = require("fs");
const async = require("async");
require('dotenv').config();

// Source: https://www.imdb.com/event/ev0000003/2020/1/
const imdbIds = [
  "tt6751668", "tt8579674", "tt1950186", "tt2584384",
  "tt7286456", "tt3281548", "tt7653254", "tt7131622",
  "tt1302006", "tt8291806", "tt8404614", "tt7549996",
  "tt6394270", "tt4648786", "tt3224458", "tt3513548",
  "tt8946378", "tt7984734", "tt4777008", "tt2527338",
  "tt2066051", "tt7083526", "tt4520988", "tt1979376",
  "tt2935510", "tt4154796", "tt6105098", "tt9351980",
  "tt9617456", "tt8991268", "tt7178226", "tt6016744",
  "tt10397932", "tt9464764", "tt9204606", "tt10009148",
  "tt10182854", "tt2386490", "tt9806192", "tt4729430",
  "tt6348138", "tt7129636", "tt10923134", "tt9536832",
  "tt10499942", "tt9032798", "tt8163822", "tt8767544",
  "tt8906678", "tt8551848", "tt11421246", "tt8649186",
  "tt10199590",
];

function createFile(jsonData) {
  fs.writeFile("dataset.json", JSON.stringify(jsonData), function (err) {
      if (err) throw err;
      console.log("complete");
    }
  );
}

let requestUrls = [];
imdbIds.forEach(function (imdbId) {
  const omdbapiEndpoint = "http://www.omdbapi.com/?apikey=" + process.env.API_KEY + "&i=";
  requestUrls.push(omdbapiEndpoint + imdbId)
});

let data = {}
async.each(requestUrls, (url, callback) => {
  axios.get(url)
    .then(response => {
      data[response.data.imdbID] = response.data;
      callback();
    })
    .catch(error => {
      console.log(error);
    });
}, err => {
  if (err) console.error(err.message);
  createFile(data);
});