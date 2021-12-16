const { Bot, InlineKeyboard } = require("grammy");
const data = require("./modules/crud");
const score = require("./modules/score");
const bot = new Bot("5081423704:AAGbnWcdekZnd8b11os3WrnCkMQsH997-so");

const approveKeyboard = new InlineKeyboard()
  .text("Approve ✅", "yes")
  .text("Reject ❌", "no")
  .row()
  .text("LeaderBoard 👀", "score");

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
      .sendMessage("959839873", messageText, {
        reply_markup: approveKeyboard,
        parse_mode: "MarkdownV2",
      })
      .then((e) => {
        data.saveMessage(messageText, messageSender, e.message_id);
      });
  }
});

bot.callbackQuery("yes", async (ctx) => {
  score.increaseScore();
  foundMessage = data.findMessage(ctx.callbackQuery.message.message_id);
  await ctx.api.sendMessage("@pcamcodehub", foundMessage, {
    parse_mode: "MarkdownV2",
  });
  data.deleteMsg(ctx.callbackQuery.message.message_id);
  ctx.deleteMessage();
});

bot.callbackQuery("no", async (ctx) => {
  data.deleteMsg(ctx.callbackQuery.message.message_id);
  await ctx.api.sendMessage(
    messageSender,
    "Your program was not approved by the admin!"
  );
  ctx.deleteMessage();
});

bot.callbackQuery("score", async (ctx) => {});

bot.catch((err) => {
  console.log(err);
});
bot.start();
