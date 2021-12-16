const fs = require("fs");
const db = require("../db.json");

var foundMessage;

function saveMessage(messageText, messageSender, messageId) {
  db.table.push({ uid: messageSender, content: messageText, mid: messageId }); //add some data
  json = JSON.stringify(db);
  fs.writeFile("db.json", json, "utf8", function error(err) {
    console.log(err);
  });
}

function findMessage(id) {
  db.table.forEach((item) => {
    if (item.mid === id) {
      foundMessage = item.content;
    }
  });
  return foundMessage;
}
function deleteMsg(delid) {
  var index = db.table.findIndex((x) => x.mid === delid);
  db.table.splice(index, 1);
  json = JSON.stringify(db);
  fs.writeFile("db.json", json, "utf8", function error(err) {
    console.log(err);
  });
}

module.exports = { saveMessage, findMessage, deleteMsg };
