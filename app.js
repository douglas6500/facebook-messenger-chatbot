var login = require("facebook-chat-api");
var aimlInterpreter = require('aimlinterpreter');

var aimlInterpreter = new aimlInterpreter(
  {name:'Claude'},
  {age: '26'},
  {website:'https://www.facebook.com/profile.php?id=100015842524768'}
);

aimlInterpreter.loadAIMLFilesIntoArray(['./dialogs/basic.aiml']);

var callback = function(answer, wildCardArray, input){
    console.log(answer + ' | ' + wildCardArray + ' | ' + input);
    sendMessage(answer);
};

var fbanswer;
function sendMessage(message) {
    fbanswer = message;
}

//aimlInterpreter.findAnswerInLoadedAIMLFiles('What is your name?', callback);
function sendAIMLMessage(message){
  aimlInterpreter.findAnswerInLoadedAIMLFiles(message, callback);
}

// Create simple echo bot
login({email: "xyz@mail.com", password: "abc123"}, function callback (err, api) {
if(err) return console.error(err);

    api.setOptions({listenEvents: true});

    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);

        switch(event.type) {
          case "message":
            if(event.body === '/stop') {
              api.sendMessage("Goodbye...", event.threadID);
              return stopListening();
            }
            api.markAsRead(event.threadID, function(err) {
              if(err) console.log(err);
            });
            console.log(event.body);
            //api.sendMessage("TEST BOT: " + event.body, event.threadID);
            sendAIMLMessage(event.body);//because it has a callback function
            api.sendMessage(fbanswer, event.threadID);
            break;
          case "event":
            console.log(event);
            break;
        }
    });
});
