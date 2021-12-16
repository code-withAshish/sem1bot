const fs = require("fs");
const score = require("../score.json");
var index = 0;
function increaseScore(uname) {
  score.table.forEach((x) => {
    if (x.name === uname) {
      x.score++;
      json = JSON.stringify(score);
      fs.writeFile("score.json", json, "utf8", function error(err) {
        console.log(err);
      });
    } else {
      index++;
    }
  });
  if (index == score.table.length) {
    createUser(uname);
  }
}

function createUser(uname) {
  score.table.push({
    name: uname,
    score: "0",
  }); //add some data
  json = JSON.stringify(score);
  fs.writeFile("score.json", json, "utf8", function error(err) {
    console.log(err);
  });
}

module.exports = { increaseScore };
