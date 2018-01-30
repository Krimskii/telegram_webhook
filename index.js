
const TOKEN = process.env.TELEGRAM_TOKEN || '448727496:AAHLPsVhd272Elei-pM35kTKv6hVPuflHjQ';

const TelegramBot = require('node-telegram-bot-api')

const options = {
  webHook: {
    // Port to which you should bind is assigned to $PORT variable
    // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
    port: process.env.PORT
    // you do NOT need to set up certificates since Heroku provides
    // the SSL certs already (https://<app-name>.herokuapp.com)
    // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
  }
};
// Heroku routes from port :443 to $PORT
// Add URL of your app to env variable or enable Dyno Metadata
// to get this automatically
// See: https://devcenter.heroku.com/articles/dyno-metadata
const url = process.env.APP_URL || 'https://telegram-krimskii.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);


// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${TOKEN}`);

const KB = {
	news: emoji.get('newspaper') + ' Новости',
	request: emoji.get('envelope') + ' Обращение',
	sendRequest: emoji.get('clipboard') + 'Отправить',
	checkRequest: emoji.get('postbox') + 'Проверить',
	readNews: emoji.get('newspaper') + ' Читать',
	subscribeNews: emoji.get('pencil') + 'Подписаться',
	back: emoji.get('back') + ' Назад'
}

bot.onText(/\/start/, msg => {
	sendGreeting(msg)
})

bot.on('message', msg => {

	switch (msg.text) {
		case KB.request:
			sendRequestScreen(msg.chat.id)
			break
		case KB.news:
			sendNewsScreen(msg.chat.id)
			break
		case KB.back:
			sendGreeting(msg, false)
			break
		case KB.sendRequest:
			applyRequestScreen(msg.chat.id)
			break
		case KB.checkRequest:		
			break
		case KB.readNews:
		case KB.subscribeNews:
			break
	}

})

function sendGreeting(msg, sayHello = true) {
	const text = sayHello
	? `Добрый день, ${msg.from.first_name}\nВас приветствует БОТ общественной приемной акимата г.Алматы`
	: `Воспользуйтесь меню` + emoji.get('point_up_2')

	bot.sendMessage(msg.chat.id, text, {
		reply_markup: {
			keyboard: [
				[KB.request, KB.news]
			],
			resize_keyboard: true,
		}
	})	
}

function sendRequestScreen(chatId) {
	bot.sendMessage(chatId, `Что вы хотите сделать?`, {
		reply_markup: {
			keyboard: [
				[KB.sendRequest, KB.checkRequest],
				[KB.back]
			],
			resize_keyboard: true,
		}
		
	})
}

function sendNewsScreen(chatId) {
	bot.sendMessage(chatId, `Будьте в курсе самых свежих новостей администрации Алматы`, {
		reply_markup: {
			keyboard: [
				[KB.readNews, KB.subscribeNews],
				[KB.back]
			],
			resize_keyboard: true,
		}
	})
}

function applyRequestScreen(chatId) {
	bot.sendMessage(chatId, `Прикрепите Ваши данные`, {
		reply_markup: {
			keyboard: [[{
				text: "Телефон",
				request_contact: true}], 
			[{
				text: "Местоположение",
				request_location: true}],
				[KB.back]],
				resize_keyboard: true,
			}
		})
}