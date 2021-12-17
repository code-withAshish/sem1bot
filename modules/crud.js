const fs = require("fs");
const db = require("../db.json");

var foundMessage;
var scoreName;
function saveMessage(messageText, messageSender, messageId, name) {
  db.table.push({
    uid: messageSender,
    content: messageText,
    mid: messageId,
    uname: name,
  }); //add some data
  json = JSON.stringify(db);
  fs.writeFile("db.json", json, "utf8", function error(err) {
    console.log(err);
  });
}

function findMessage(id) {
  db.table.forEach((item) => {
    if (item.mid === id) {
      foundMessage = item.content;
      scoreName = item.uname;
      chatid = item.uid;
    }
  });
  return { msg: foundMessage, name: scoreName, chatID: chatid };
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
