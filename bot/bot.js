const TelegramBot = require('node-telegram-bot-api');


const token = '7387236001:AAFRrx9dQWMs4axxVYgNCTUWUkfIjy2JK28';
const bot = new TelegramBot(token, { polling: true });

console.log('hello');

const messageLimit = 10;
const timeLimit = 50 * 1000;

const messageCounts = {};

bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const firstName = msg.from.first_name;
    const messageId = msg.message_id;

    if(!messageCounts[chatId]) {
        messageCounts[chatId] = {count: 0, timer: null};
    }

    messageCounts[chatId].count++;

    if(!messageCounts[chatId].timer) {
        messageCounts[chatId].timer = setTimeout(() => {
            messageCounts[chatId].count = 0;
            messageCounts[chatId].timer = null;
        }, timeLimit)
    }


    if(messageCounts[chatId].count >= messageLimit) {

        bot.sendMessage(chatId, 'A lot of messages over here');


        clearTimeout(messageCounts[chatId].timer);
        messageCounts[chatId] = {count: 0, timer: null};
    }



    if(text.includes("Hello") || text.includes("new")) {
        bot.sendMessage(chatId, `Hi ${firstName}, welcome to our chat`);
    } else if(text.includes("site")) {
        bot.sendMessage(chatId, "Here you can visit the website:", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Visit Website", url: "https://mer-fish.netlify.app" }],
                    [{ text: "Click Me", callback_data: "button_click" }]
                ]
            }
        });
    }


    if(text.includes("deleted message")) {

        setTimeout(() => {
            bot.deleteMessage(chatId, messageId);

        }, 5000);
        
       
    }
   
});








bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  const newMembers = msg.new_chat_members;

  newMembers.forEach((member) => {
    const name = member.first_name || member.username || 'new user';
    bot.sendMessage(chatId, `Hello ${name}! Welcome to the group! 🎉`);
  });
});


bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.message}`);
  });
