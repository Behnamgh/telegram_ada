const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const { reply } = Telegraf;
const data = require('./data.js');
const session = require('telegraf/session');
const { MongoClient } = require('mongodb');
const MongoSession = require('telegraf-session-mongo');

const app = new Telegraf('545286549:AAGesxStZdLALNz6UlXDWoURDRDSF15gxGU');

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
        
        app.command("check", (ctx) => {
            ctx.reply(ctx.session);
        });
        app.command("db", (ctx) => {
            session.getSession(ctx.message.from.id).then(result => {
                console.log(result);
                ctx.reply(result);
            })
        });
        app.command("adds", (ctx) => {
            ctx.session[2] = 'test';
        });
        app.command("add", (ctx) => {
            ctx.session[Object.keys(ctx.session).length] = ctx.message.text;
            ctx.reply(ctx.session);
        });



        changeTurn = (ctx) => {
            let turn = ctx.session.turn;
            if (turn === 'first') {
                ctx.session.turn = 'second';
                ctx.reply('نوبت گروه: ' + ctx.session.second.name);
            } else {
                ctx.session.turn = 'first';
                ctx.reply('نوبت گروه: ' + ctx.session.first.name);
            }
        }


        // app.use(Telegraf.log());

        // bot.use(session());



        app.command('catagory', (ctx) => {
            session.getSession(ctx.message.from.id).then(result => {
                console.log(result);
                ctx.reply(result);
            })
        });
        app.command('session', (ctx) => {
            return ctx.reply(ctx.session);
        });
        app.command('team', (ctx) => {
            const input = ctx.message.text;
            let first = input.substring(input.indexOf(' ') + 1, input.lastIndexOf(' '));
            let second = input.substring(input.lastIndexOf(' ') + 1);
            let element = {};
            ctx.session.turn = 'first';

            element.first = {};
            element.first.name = first;
            element.first.point = 0;

            element.second = {};
            element.second.name = second;
            element.second.point = 0;

            ctx.session.first = element.first;
            ctx.session.second = element.second;


            console.log(ctx.session);
            ctx.reply(first + ' vs ' + second);
            var array = Object.keys(data);
            console.log(array);
            return ctx.reply('یکی از دسته های زیر را انتخاب کنید', Extra.markup(
                Markup.keyboard(array)
            ));
        });
        app.hears(['علمی', 'ورزشی', 'فیلم_و_سینما', 'عمومی', 'اماکن_و_گردشگری'], (ctx) => {
            ctx.session.catagory = ctx.message.text;
            // console.log(ctx.session[ctx.session.turn]);
            var array = Object.keys(data[ctx.message.text]);
            return ctx.reply('سطح مورد نظر را انتخاب کنید', Extra.markup(
                Markup.keyboard(array)
            ));
        });

        app.hears(['دو امتیازی', 'چهار امتیازی', 'شش امتیازی'], (ctx) => {
            // console.log(ctx.session);

            // console.log(data[ctx.session[ctx.session.turn].catagory][ctx.message.text]);

            var array = Object.keys(data[ctx.session.catagory][ctx.message.text]);
            ctx.session.go = data[ctx.session.catagory][ctx.message.text][getRandomInt(array.length)];
            ctx.session.selected = ctx.message.text;
            // console.log(data[ctx.session.catagory]);
            // console.log(data[ctx.session.catagory][ctx.message.text]);
            // console.log();

            return ctx.reply('کلمه شما انتخاب شد.', Extra.markup(
                Markup.keyboard(['شروع'])
            ));
        });

        app.hears('شروع', (ctx) => {
            let target = ctx.session.go;
            ctx.session.start = new Date();
            return ctx.reply(target, Extra.markup(
                Markup.keyboard(['تمام', ' انصراف'])
            ));
        });
        app.hears('تمام', (ctx) => {
            let element = ctx.session[ctx.session.turn];
            let startTime = new Date(ctx.session['start']);
            let diff = new Date() - startTime;
            diff = 90 - (diff / 1000);
            let turn = ctx.session.turn;
            if (element.save){

                element.save += diff;
            } else {
                element.save = diff;
            }
            let point;
            switch (ctx.session.selected) {
                case 'دو امتیازی':
                    point = 2;
                    break;
                case 'چهار امتیازی':
                    point = 4;
                    break;

                case 'شش امتیازی':
                    point = 6;
                    break;
            }
            element.point += point;
            // ctx.session[turn].point += point;
            let yourPoint = element.point;
            changeTurn(ctx);
            ctx.session[turn] = element;
            var array = Object.keys(data);
            // session.saveSession(ctx.message.from.id, ctx.session);
            return ctx.reply('امتیاز شما: ' + yourPoint + '\nزمان ذخیره: + ' + diff + ',\nیکی از دسته های زیر را انتخاب کنید', Extra.markup(
                Markup.keyboard(array)
            ));
        });
        app.hears('انصراف', (ctx) => {

            changeTurn(ctx);

            console.log(ctx.session);
            var array = Object.keys(data);
            console.log(ctx.session);
            return ctx.reply('you earned 0,\nیکی از دسته های زیر را انتخاب کنید', Extra.markup(
                Markup.keyboard(array)
            ));
        });

        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
    });
});
app.startPolling();
