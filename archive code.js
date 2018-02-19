  bot.command('onetime', ({ reply }) =>
  reply('One time keyboard', Markup
    .keyboard(['/simple', '/inline', '/pyramid'])
    .oneTime()
    .resize()
    .extra()
  )
)



bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
bot.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))

bot.command('special', (ctx) => {
  return ctx.reply('Special buttons keyboard', Extra.markup((markup) => {
    return markup.resize()
      .keyboard([
        markup.contactRequestButton('Send contact'),
        markup.locationRequestButton('Send location')
      ])
  }))
})

bot.command('pyramid', (ctx) => {
  return ctx.reply('Keyboard wrap', Extra.markup(
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
    })
  ))
})

bot.command('simple', (ctx) => {
  return ctx.replyWithHTML('<b>Coke</b> or <i>Pepsi?</i>', Extra.markup(
    Markup.keyboard(['Coke', 'Pepsi'])
  ))
})

bot.command('inline', (ctx) => {
  return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton('Coke', 'Coke'),
      m.callbackButton('Pepsi', 'Pepsi')
    ])))
})

bot.command('random', (ctx) => {
  return ctx.reply('random example',
    Markup.inlineKeyboard([
      Markup.callbackButton('Coke', 'Coke'),
      Markup.callbackButton('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
      Markup.callbackButton('Pepsi', 'Pepsi')
    ]).extra()
  )
})

bot.hears(/\/wrap (\d+)/, (ctx) => {
  return ctx.reply('Keyboard wrap', Extra.markup(
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      columns: parseInt(ctx.match[1])
    })
  ))
})

bot.action('Dr Pepper', (ctx, next) => {
  return ctx.reply('👍').then(() => next())
})

bot.action(/.+/, (ctx) => {
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
})


const Telegraf = require('telegraf');

bot.start((ctx) => {
  console.log('started:', ctx.from.id)
  return ctx.reply('Welcome!')
});
bot.command('help', (ctx) => ctx.reply('Try send a sticker!'));
bot.hears('hi', (ctx) => ctx.reply('Hey there!'));
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy!'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.startPolling();

const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const session = require('telegraf/session');
const { reply } = Telegraf;

let organize = (ctx, next) => {
    let value = ctx.session[ctx.from.id];
    console.log(value);
    next();
}

// const bot = new Telegraf(process.env.BOT_TOKEN);
const bot = new Telegraf('545286549:AAGesxStZdLALNz6UlXDWoURDRDSF15gxGU');

bot.use(session());

// Register logger middleware
bot.use((ctx, next) => {
    const start = new Date();
    return next().then(() => {
        const ms = new Date() - start;
        // console.log(ctx.from);
        console.log('response time %sms', ms);
    })
})

// Random location on some text messages
bot.on('text', ({ replyWithLocation }, next) => {
    if (Math.random() > 0.2) {
        return next();
    };
    return Promise.all([
        replyWithLocation((Math.random() * 180) - 90, (Math.random() * 180) - 90),
        next()
    ]);
})

// Text messages handling
bot.hears('Hey', organize, (ctx) => {
    ctx.session.heyCounter = ctx.session.heyCounter || 0;
    ctx.session.heyCounter++;
    return ctx.replyWithMarkdown(`_Hey counter:_ ${ctx.session.heyCounter}`);
})

bot.command('answer', organize, (ctx) => {
    console.log(ctx.message);
})
bot.command('game', (ctx) => {
    ctx.session[ctx.from.id] = '{ "owner": "' + ctx.from.username + '", "id": ' + ctx.from.id + '}';
    console.log(ctx.session[ctx.from.id]);

    return ctx.reply(ctx.session);
});
bot.hears('text', organize, (ctx) => {


    // let value = JSON.parse(ctx.session[ctx.from.id]);
    // console.log(value.owner);
    return ctx.reply(ctx.session);
});
// Wow! RegEx
bot.hears(/reverse (.+)/, ({ match, reply }) => reply(match[1].split('').reverse().join('')));

// Start polling
bot.startPolling();