const { Bot } = require("grammy");

const bot = new Bot("5081423704:AAGbnWcdekZnd8b11os3WrnCkMQsH997-so");

bot.command("start", (ctx) => {
  ctx.reply(
    `Hello! ${ctx.from.first_name} send me a program and i will post it in the @pcamcodehub channel for you 😃`
  );
});

bot.on("message:text", (ctx) => {
  if (ctx.chat.type === "private") {
    var a = "`" + ctx.message.text + "\n" + `-by ${ctx.from.first_name}` + "`";
    ctx.api.sendMessage("@pcamcodehub", a, {
      parse_mode: "MarkdownV2",
    });
  }
});

bot.start();
