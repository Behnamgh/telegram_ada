const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const { reply } = Telegraf;
const data = require('./data.js');
const session = require('telegraf/session');
const { MongoClient } = require('mongodb');
const MongoSession = require('telegraf-session-mongo');

// const bot = new Telegraf();
const app = new Telegraf('545286549:AAGesxStZdLALNz6UlXDWoURDRDSF15gxGU');

// MongoClient.connect('mongodb://127.0.0.1:27017', function (err, database) {
//     var db=database.db('sessions');
//     var collections=db.collection('sessions');
//     collections.insert({name: 'behnam'}, (err, result) => {
//         console.log(result);
//     });
// });

MongoClient.connect('mongodb://127.0.0.1:27017', function (err, database) {
    var db = database.db('adabazi');
    const session = new MongoSession(db, {
        getSessionKey: (ctx) => ctx.message.from.id,
        ttl: 36000000,
        collection: 'sessions'
        // ttl - in milliseconds 
        // property - name of the context property for the session (default: session) 
        // collection - name of the mongodb collection for the sessions (default: sessions) 
        // getSessionKey - function (ctx) => String (default "chatId:fromId") 
    });
    session.setup().then(() => {
        app.use(session.middleware);

        app.command("session", (ctx) => {
            ctx.reply(`<pre>${ctx.session, null, 2}</pre>`);
        });
        app.command("check", (ctx) => {
            ctx.reply(ctx.session);
        });
        app.command("db", (ctx) => {
            //  var output = db.sessions.find();
            session.getSession(ctx.message.from.id).then(result => {
                console.log(result);
                ctx.reply(result);
            })
        });
        app.command("adds", (ctx) => {
            ctx.session[2]= 'test';
        });
        app.command("add", (ctx) => {
                ctx.session[Object.keys(ctx.session).length] = ctx.message.text;
                ctx.reply(ctx.session);
               

        });
    });
});
// .then(client => {

//     const session = new MongoSession(client, {
//         // ttl - in milliseconds 
//         // property - name of the context property for the session (default: session) 
//         // collection - name of the mongodb collection for the sessions (default: sessions) 
//         // getSessionKey - function (ctx) => String (default "chatId:fromId") 
//     });

//     // Setup function creates necessary indexes for ttl and key lookup 
//     session.setup().then(() => {
//         app.use(session.middleware);

//         app.command("session", (ctx) => {
//             ctx.respondWithHTML(`<pre>${ctx.session, null, 2}</pre>`);
//         });
//     });
// });

// setCatagory = (ctx, next) => {
//     let element = ctx.session;
//     element[element.turn].catagory = ctx.message.text;
//     ctx.session = element;
//     next();
// }

// changeTurn = (ctx) => {
//     let turn = ctx.session.turn;
//     if (turn === 'first') {
//         ctx.session.turn = 'second';
//     } else {
//         ctx.session.turn = 'first';
//     }
// }


 app.use(Telegraf.log())

// bot.use(session());



// bot.command('catagory', (ctx) => {
//     var array = Object.keys(data);
//     return ctx.reply('choose a catagory', Extra.markup(
//         Markup.keyboard(array)
//     ));
// });
// bot.command('session', (ctx) => {
//     return ctx.reply(ctx.session);
// });
// bot.command('team', (ctx) => {
//     const input = ctx.message.text;
//     let first = input.substring(input.indexOf(' ') + 1, input.lastIndexOf(' '));
//     let second = input.substring(input.lastIndexOf(' ') + 1);
//     let element = {};
//     element.turn = 'first';

//     element.first = {};
//     element.first.name = first;
//     element.first.point = 0;

//     element.second = {};
//     element.second.name = second;
//     element.second.point = 0;

//     ctx.session = element;
//     console.log(ctx.session);
//     ctx.reply(first + ' vs ' + second);
//     var array = Object.keys(data);
//     return ctx.reply('choose a catagory', Extra.markup(
//         Markup.keyboard(array)
//     ));
// });
// bot.hears(['علمی', 'ورزشی', 'فیلم_و_سینما', 'عمومی', 'اماکن_و_گردشگری'], setCatagory, (ctx) => {
//     var array = Object.keys(data[ctx.message.text]);
//     console.log(ctx.session);
//     return ctx.reply('choose a level', Extra.markup(
//         Markup.keyboard(array)
//     ));
// });

// bot.hears(['simple', 'normal', 'hard'], (ctx) => {
//     console.log(ctx.session);
//     console.log(ctx.session[ctx.session.turn].catagory);

//     console.log(data[ctx.session[ctx.session.turn].catagory]);

//     // console.log(data[ctx.session[ctx.session.turn].catagory][ctx.message.text]);

//     var array = Object.keys(data[ctx.session[ctx.session.turn].catagory][ctx.message.text]);
//     ctx.session.go = data[ctx.session[ctx.session.turn].catagory][ctx.message.text][getRandomInt(array.length)];
//     ctx.session.selected = ctx.message.text;
//     return ctx.reply('word accepted', Extra.markup(
//         Markup.keyboard(['ready', ' cancel'])
//     ));
// });


// bot.hears('ready', (ctx) => {
//     let target = ctx.session['go'];
//     ctx.session['start'] = new Date();
//     return ctx.reply(target, Extra.markup(
//         Markup.keyboard(['stop', ' cancel'])
//     ));
// });
// bot.hears('stop', (ctx) => {
//     let diff = new Date() - ctx.session['start'];
//     diff = 90 - (diff / 1000);
//     let turn = ctx.session.turn;
//     ctx.session[turn].save += diff;
//     let point;
//     switch (ctx.session.selected) {
//         case 'simple':
//             point = 2;
//             break;
//         case 'normal':
//             point = 4;
//             break;

//         case 'hard':
//             point = 6;
//             break;
//     }
//     ctx.session[turn].point += point;
//     let yourPoint = ctx.session[turn].point;
//     changeTurn(ctx);

//     console.log(ctx.session);
//     var array = Object.keys(data);
//     console.log(ctx.session);
//     return ctx.reply(yourPoint + 'achived,\nchoose a catagory', Extra.markup(
//         Markup.keyboard(array)
//     ));
// });
// bot.hears('cancel', (ctx) => {

//     changeTurn(ctx);

//     console.log(ctx.session);
//     var array = Object.keys(data);
//     console.log(ctx.session);
//     return ctx.reply('you earned 0,\nchoose a catagory', Extra.markup(
//         Markup.keyboard(array)
//     ));
// });

// function getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
// }
app.startPolling()
