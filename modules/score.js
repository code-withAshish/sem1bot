const fs = require("fs");
const score = require("../score.json");

var index = 0;
function increaseScore(uname) {
  score.user.forEach((x) => {
    if (x.name === uname) {
      x.score++;
      score.user.sort(sortByProperty("score"));
      json = JSON.stringify(score);
      fs.writeFile("score.json", json, "utf8", function error(err) {
        console.log(err);
      });
    } else {
      index++;
    }
  });
  if (index == score.user.length) {
    createUser(uname);
  }
}

function sortByProperty(property) {
  return function (a, b) {
    if (a[property] < b[property]) return 1;
    else if (a[property] < b[property]) return -1;
    return 0;
  };
}

function createUser(uname) {
  score.user.push({
    name: uname,
    score: "0",
  }); //add some data
  json = JSON.stringify(score);
  fs.writeFile("score.json", json, "utf8", function error(err) {
    console.log(err);
  });
}
function getScoreBoard() {
  var count = 1;
  var leaderBoard = "\tScore Board:-\n\n";
  score.user.forEach((item) => {
    leaderBoard += count + ") " + item.name + " => " + item.score + "\n";
    count++;
  });
  return leaderBoard;
}

module.exports = { increaseScore, getScoreBoard };
