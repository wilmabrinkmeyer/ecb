
const answerTexts = require('../data/answerTexts.json')
function tellJoke(){
    let jokesArray=['I\'m so good at sleeping. I can do it with my eyes closed.',
    'My boss told me to have a good day.. so I went home.',
    'Why is Peter Pan always flying? He neverlands.',
    'A woman walks into a library and asked if they had any books about paranoia. The librarian says \"They\'re right behind you!\"',
    'Why do blind people hate skydiving? It scares the hell out of their dogs.',
    'When you look really closely, all mirrors look like eyeballs.',
    'My friend says to me: \"What rhymes with orange\" I said: \"No it doesn\'t\"',
    'What do you call a guy with a rubber toe? Roberto.',
    'I ate a clock yesterday, it was very time consuming.',
    'I know a lot of jokes about unemployed people but none of them work.'];
    let joke = jokesArray[Math.floor(Math.random()*jokesArray.length)];
    return joke
};
exports.tellJoke = tellJoke;

function getAnswer(){

}