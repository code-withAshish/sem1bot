const { Bot, InlineKeyboard } = require("grammy");
const data = require("./modules/crud");
const score = require("./modules/score");
const bot = new Bot("5081423704:AAGbnWcdekZnd8b11os3WrnCkMQsH997-so");
var board;
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
    messageText =
      "`" + ctx.message.text + "\n" + `-by ${ctx.from.first_name}` + "`";
    messageSender = ctx.from.id;

    ctx.api
      .sendMessage("-1001515865371", messageText, {
        reply_markup: approveKeyboard,
        parse_mode: "MarkdownV2",
      })
      .then((e) => {
        if (ctx.from.first_name != undefined)
          data.saveMessage(
            messageText,
            messageSender,
            e.message_id,
            ctx.from.first_name
          );
        else
          data.saveMessage(
            messageText,
            messageSender,
            e.message_id,
            ctx.from.username
          );
      });
  }
});

bot.callbackQuery("yes", async (ctx) => {
  const query = data.findMessage(ctx.callbackQuery.message.message_id);
  await ctx.api.sendMessage("@pcamcodehub", query.msg, {
    parse_mode: "MarkdownV2",
  });
  score.increaseScore(query.name);
  data.deleteMsg(ctx.callbackQuery.message.message_id);
  ctx.deleteMessage();
});

bot.callbackQuery("no", async (ctx) => {
  const query = data.findMessage(ctx.callbackQuery.message.message_id);
  data.deleteMsg(ctx.callbackQuery.message.message_id);
  await ctx.api.sendMessage(
    query.chatID,
    "Your program was not approved by the admin!!!\nPlease try again."
  );
  ctx.deleteMessage();
});

bot.callbackQuery("score", async (ctx) => {
  board = score.getScoreBoard();
  ctx.reply(board, {
    reply_markup: scoreKeyboard,
  });
});

bot.callbackQuery("back", (ctx) => {
  ctx.deleteMessage();
});

bot.callbackQuery("send", (ctx) => {
  ctx.api.sendMessage("@pcamcodehub", board);
});

bot.catch((err) => {
  console.log(err);
});
bot.start();
