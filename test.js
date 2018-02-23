const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const { reply } = Telegraf;
const session = require('telegraf/session');

const bot = new Telegraf('545286549:AAGesxStZdLALNz6UlXDWoURDRDSF15gxGU');

bot.use(Telegraf.log());
bot.startPolling()
