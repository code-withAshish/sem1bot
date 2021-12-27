const { Bot, InlineKeyboard } = require("grammy");
// require("dotenv").config();
//use this for local development
const user = require("./models/user");
const score = require("./models/score");
const mongoose = require("mongoose");
const bot = new Bot(process.env.BOT_TOKEN);
mongoose
  .connect(process.env.dbURL, {
    useNewUrlParser: true,
  })
  .then((x) => {
    console.log("Connected to MongoDB");
  });
const approveKeyboard = new InlineKeyboard()
  .text("Approve ✅", "yes")
  .text("Reject ❌", "no")
  .row()
  .text("LeaderBoard 👀", "score");

const scoreKeyboard = new InlineKeyboard()
  .text("Back", "back")
  .text("Send to channel", "send");

bot.command("start", (ctx) => {
  ctx.reply(
    `Hello! ${ctx.from.first_name} send me a program and i will post it in the @pcamcodehub channel for you 😃`
  );
});

bot.on("message:text", (ctx) => {
  if (ctx.chat.type === "private") {
    var name =
      ctx.from.first_name != undefined
        ? ctx.from.first_name
        : ctx.from.username;

    ctx.reply("Please wait while we are checking your code....");
    ctx.api
      .sendMessage(
        "-1001515865371",
        "`" + ctx.message.text + "\n" + `by- ${name}` + "`",
        {
          reply_markup: approveKeyboard,
          parse_mode: "MarkdownV2",
        }
      )
      .then((e) => {
        user
          .insertMany([
            {
              uname: name,
              uID: ctx.from.id,
              msgID: e.message_id,
              msg: ctx.message.text,
            },
          ])
          .then((x, err) => {
            if (err) console.error(err);
            console.log(x);
          });
      });
  }
});

bot.callbackQuery("yes", async (ctx) => {
  user
    .findOneAndDelete({
      msgID: ctx.callbackQuery.message.message_id,
    })
    .then((x) => {
      ctx.api.sendMessage(x.uID, "Your code has been approved!\n\n");
      var msg = "`" + `${x.msg}\n` + `-by ${x.uname}` + "`";
      ctx.api.sendMessage("@pcamcodehub", msg, {
        parse_mode: "MarkdownV2",
      });
      userScore(x.uname);
      ctx.api.deleteMessage("-1001515865371", x.msgID);
    });
});

bot.callbackQuery("no", async (ctx) => {
  ctx.deleteMessage();
  user
    .findOneAndDelete({ msgID: ctx.callbackQuery.message.message_id })
    .then((x) => {
      ctx.api.sendMessage(
        x.uID,
        "Your program has some errors,so admins have rejected it\nPlease try again!!!"
      );
      console.log(x);
    });
});

bot.callbackQuery("score", async (ctx) => {
  var board = "🏆 LeaderBoard 🏆\n\n";
  score
    .find()
    .sort({ points: "descending" })
    .then((x) => {
      x.forEach((e) => {
        board += `<b><i>${e.name}</i> --- ${e.points}\n</b>`;
      });
      ctx.reply(board, {
        reply_markup: scoreKeyboard,
        parse_mode: "HTML",
      });
    });
});

bot.callbackQuery("back", (ctx) => {
  ctx.deleteMessage();
});

bot.callbackQuery("send", (ctx) => {
  var board = "🏆 LeaderBoard 🏆\n\n";
  score
    .find()
    .sort({ points: "descending" })
    .then((x) => {
      x.forEach((e) => {
        board += `<b><i>${e.name}</i> --- ${e.points}\n</b>`;
      });
      ctx.api.sendMessage("@pcamcodehub", board, {
        reply_markup: scoreKeyboard,
        parse_mode: "HTML",
      });
    });
});

bot.catch((err) => {
  console.log(err);
});
bot.start();

function userScore(uname) {
  score.findOne({ name: uname }).then((x) => {
    if (x) {
      score.updateOne({ name: uname }, { $inc: { points: 1 } }).then(() => {
        console.log("Score Updated");
      });
    } else {
      score.insertMany([
        {
          name: uname,
          points: 1,
        },
      ]);
    }
  });
}
