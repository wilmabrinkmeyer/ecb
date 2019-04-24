"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
var builder = require('botbuilder');
var cardTitle = '';

function createHeroCard(topIntent) {
    let title;
    let subtitle;
    if (topIntent === "DiskRequirements") {
        title = 'Upload Document?';
        subtitle = 'If you upload your requirements form I can analyse it and help you to fill out the blanks';
    }
    return botbuilder_1.CardFactory.heroCard(title, botbuilder_1.CardFactory.images([]), botbuilder_1.CardFactory.actions([
        {
            type: botbuilder_1.ActionTypes.PostBack,
            title: "Upload",
            value: "form upload"
        },
        {
            type: botbuilder_1.ActionTypes.PostBack,
            title: "No Thanks",
            value: "no thanks"
        }
    ]), {
        subtitle: subtitle
    });
}
exports.createHeroCard = createHeroCard;
function createSimpleHeroCard(title, value, image) {
    return botbuilder_1.CardFactory.heroCard(cardTitle, botbuilder_1.CardFactory.images([image]), botbuilder_1.CardFactory.actions([
        {
            type: botbuilder_1.ActionTypes.PostBack,
            title: title,
            value: value,
        },
    ]));
}
exports.createSimpleHeroCard = createSimpleHeroCard;
function createCarousel(titles, values, images) {
    const heroCards = [];
    for (let i = 0; i < titles.length; i++) {
        heroCards.push(createSimpleHeroCard(titles[i], values[i], images[i]));
    }
    return botbuilder_1.MessageFactory.carousel(heroCards);
}
exports.createCarousel = createCarousel;


function createHeroCard(title, subtitle, buttonTitle1, buttonTitle2, buttonValue1, buttonValue2) {
    if (topIntent === "DiskRequirements") {
        title = 'Upload Document?';
        subtitle = 'If you upload your requirements form I can analyse it and help you to fill out the blanks';
    }
    return botbuilder_1.CardFactory.heroCard(title, botbuilder_1.CardFactory.images([]), botbuilder_1.CardFactory.actions([
        {
            type: botbuilder_1.ActionTypes.PostBack,
            title: "Upload",
            value: "form upload"
        },
        {
            type: botbuilder_1.ActionTypes.PostBack,
            title: "No Thanks",
            value: "no thanks"
        }
    ]), {
        subtitle: subtitle
    });
}
exports.createHeroCard = createHeroCard;
//# sourceMappingURL=ecb-cards.js.map