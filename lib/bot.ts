import { TurnContext, ConversationState, BotFrameworkAdapter } from "botbuilder";
import { WaterfallDialog, ChoicePrompt, WaterfallStepContext, PromptOptions, DialogSet } from "botbuilder-dialogs";
import { QnAMaker, LuisRecognizer } from "botbuilder-ai";
import { BlobStorage } from "botbuilder-azure";
import {generateAnalysisAnswer} from '../helper/parse_requirements' ;
import { createHeroCard, createCarousel } from "../helper/ecb-cards";
import {tellJoke} from "../helper/helperFunctions" ;

let images =['https://www.file-extension.info/images/resource/formats/data.png','https://cdn2.iconfinder.com/data/icons/plump-by-zerode_/256/Folder-Archive-zip-icon.png','https://cdn4.iconfinder.com/data/icons/VistaICO_Toolbar-Icons/256/Folder-Secure.png','https://image.flaticon.com/icons/png/512/51/51400.png']
let titles= ['File Format', 'Data Compression','Multi-Part Container', 'Number of Files']
let values =[ 'fileformat?','datacompression?','multipartcontainer?','numfiles?']
let answerDataFormat = "Data Format: \nSource data format is refering to the original raw data format you will use for the upload to DISC. DISC is supporting simple text (.txt), comma seperated values (.csv), Extensible Markup Language (.xml), Oracle tables and many more.\n For a complete list of supported file formats visit Hyperlink\n\n";
let answerDataCompression = "Data Compression: \nYou will probably upload your data in a compressed form to speed up the upload process. Please specify the compression format you will use. If you are not using any compression select \"none\"\n\n ";
let answerMultipartContainer = "Multipart Container:\nThese are the various parts of an archive. For example, one file can be divided into two ZIP-Containers: part one and part two.\n\n";
let answerNumberOfFiles = "Number of Files:\nPlease specify the number of uncompressed files or the number of compressed file containers you will use";
   

export class ConfBot {
    private _savedSessions: string[];
    private _qnaMaker: QnAMaker;
    private _luis: LuisRecognizer;
    private _dialogs: DialogSet;
    private _conversationState: ConversationState;
    private _storage: BlobStorage;
    private _adapter: BotFrameworkAdapter;
    constructor(SavedSessions: string[], qnaMaker: QnAMaker, luis: LuisRecognizer, dialogs: DialogSet, conversationState: ConversationState, storage: BlobStorage, adapter: BotFrameworkAdapter) {
        this._savedSessions = SavedSessions;
        this._qnaMaker = qnaMaker;
        this._luis = luis;
        this._dialogs = dialogs;
        this._conversationState = conversationState;
        this._storage = storage;
        this._adapter = adapter
    }
    async onTurn(context: TurnContext) {
        const dc = await this._dialogs.createContext(context);
        await dc.continueDialog();
        if (context.activity.text != null && context.activity.text === "help") {
            await dc.beginDialog("help");
        }
        else if (context.activity.type === "message") {
            if(!context.responded) {
                const qnaResults = await this._qnaMaker.generateAnswer(context.activity.text);
                if(qnaResults.length > 0 && qnaResults[0].score > 0.75) {
                    await context.sendActivity(qnaResults[0].answer);
                }
                else {
                    await this._luis.recognize(context).then(res =>{
                        const top = LuisRecognizer.topIntent(res);
                        let answer = generateAnalysisAnswer()
                        let joke =''
                        if (top ==='DiskRequirements'){
                            context.sendActivity({ attachments: [createHeroCard(top)] });
                        } else if (top ==='Upload'){
                                context.sendActivity(`${generateAnalysisAnswer()}`);
                        } else if (top === 'Hello'){
                            context.sendActivity('Hello I am the DISC-Advisor a virtual assistant, I can help you with any questions regarding DISC')
                        } else if (top === 'Refuse'){
                            context.sendActivity('You can also choose a topic to get help with the requirements.')
                            context.sendActivity(createCarousel(titles,values,images));
                        } else if (top === 'DataCompression'){
                            context.sendActivity(answerDataCompression)
                        }else if (top === 'FileFormat'){
                            context.sendActivity(answerDataFormat)
                        }else if (top === 'NumFiles'){
                            context.sendActivity(answerNumberOfFiles)
                        } else if (top ==='Joke'){
                            joke = tellJoke()
                            context.sendActivity(joke)
                        }
                        
                    })
                }
            }
        }
        await this._conversationState.saveChanges(context);
    }
}
