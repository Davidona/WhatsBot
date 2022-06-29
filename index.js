const qrcode = require('qrcode-terminal');

const {
    Client,
    LocalAuth
} = require('whatsapp-web.js');
const cleverbot = require("cleverbot-free");
const whiteList = [] // list of whitelisted people, can keep empty.
const chatContext = {}
const english = /^[a-zA-Z0-9$@$!%{}()*?&#^-_. +]+$/
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {
        small: true
    });
});

client.on('ready', () => {
    for (var i = 0; i < whiteList.length; i++) {
        chatContext[whiteList[i]] = []
    }
    console.log('Client is ready!');
});

client.on('message', message => {
    const user = message.getChat()
    user.then(function (result) {
        var msg = message.body
        var chatName = (result.name)
        if (whiteList.length === 0 && !(chatName in chatContext)) {
            chatContext[chatName] = []
        }
        if (chatName in chatContext && msg != '' && english.test(msg)) {
            try {
                cleverbot(msg, chatContext[result.name]).then(response => {
                    client.sendMessage(message.from, response);
                    chatContext[result.name].push(msg)
                    chatContext[result.name].push(response)
                })
            } catch (e) {
                console.log(e)
            }
        }
    })

})
client.initialize();