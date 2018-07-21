import { BotFrameworkAdapter, MemoryStorage, ConversationState } from "botbuilder";
import { QnAMaker, LuisRecognizer } from "botbuilder-ai";
import * as restify from "restify";
import { ConfState, SpeakerSession } from "./types";
import { BotConfig } from "botbuilder-config";
import { config } from "dotenv";
import { getData } from "./parser";

config();

const botConfig = new BotConfig("./edui2018.bot", process.env.BOT_FILE_SECRET);

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

const conversationState = new ConversationState<ConfState>(new MemoryStorage());
adapter.use(conversationState);

const qnaMaker = new QnAMaker({
    knowledgeBaseId: botConfig.QnAMaker().kbId,
    endpointKey: botConfig.QnAMaker().endpointKey,
    host: botConfig.QnAMaker().hostname
},
{
    answerBeforeNext: true
});
adapter.use(qnaMaker);

const luis = new LuisRecognizer({
    appId: botConfig.LUIS().appId,
    subscriptionKey: botConfig.decrypt(botConfig.LUIS().subscriptionKey, botConfig.secret),
    serviceEndpoint: botConfig.LUIS().endpointBasePath
});

server.post("/api/messages", (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        if (context.activity.type === "message") {
            await luis.recognize(context).then(res => {
                let top = LuisRecognizer.topIntent(res);
                let data: SpeakerSession[];
                switch(top) {
                    case "Speaker":
                    case "Location":
                    case "Time":
                    case "Topic":
                        data = getData(res.entities);
                        console.log(res);
                        console.log(data);
                        //if(data.length > 1) {
                            //return dialogs.createChoiceOptions(data);
                        //}
                        //return (data.length === 1) ? dialogs.createHeroCard(sess, data[0], intent) : null;
                    default:
                        context.sendActivity(`No way to handle ${top}`);
                        break;
                }
            });
        }
        else if (context.activity.type === "message" && !context.responded) {
            await context.sendActivity("No QnA Maker answers were found.");
        }
        else if (context.activity.type !== "message") {
            await context.sendActivity(`[${context.activity.type} event detected]`);
        }
    });
});
