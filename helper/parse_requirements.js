let docParser = require('docx-parser');
let filename = './data/ECB-FunctionalDesign.docx';
const fs = require('fs')
let rawText;
let fileFormat;
let compression;
let multiPartContainers;
let uncompressedFiles='';
let compressedFiles='';
let numOfFiles;
let numOfAnswered;
let indexEins;
let indexZwei;
let indexDrei;
let indexVier;
let indexFive;

function getIndices (filename) {
    docParser.parseDocx(filename, function (data) {
        rawText = data;

        data.toString().split("\n").forEach(function (line, index, arr) {
            if (index === arr.length - 1 && line === "") {
                return;
            }
            if (line.trim() === 'Total Load Volume of') {
                indexFive = index
            }
            if (line.trim() === 'Load-001') {
                indexEins = index + 1;

            }
            if (line.trim() === 'Load-002') {
                indexZwei = index + 1
            }
            if (line.trim() === 'Load-003') {
                indexDrei = index + 1
            }if (line.trim() === 'Load-004') {
                indexVier = index + 1
            }
        })

    })
}

function parseDoc(filename){
    docParser.parseDocx(filename,function (data) {
        rawText = data;
        fileFormat='';
        compression='';
        multiPartContainers='';
        numOfFiles='';
        numOfAnswered = 0


        data.toString().split("\n").forEach(function (line, index, arr) {
            if (index === arr.length - 1 && line === "") {
                return;
            }
            if (index > indexEins && index <indexEins + 7 && line.search('☒')!== -1){
             console.log('Angekreuzt ist ' + line);
             fileFormat = line
             numOfAnswered += 1
            }
            if (index > indexZwei && index < indexZwei + 5 && line.search('☒')!== -1){
                console.log('Angekreuzt ist ' + line);
                compression = line
                numOfAnswered += 1

            }
            if (index > indexDrei && index < indexDrei + 3 && line.search('☒')!== -1){
                console.log('Angekreuzt ist ' + line);
                multiPartContainers = line
                numOfAnswered += 1

     
            }
            if (index === indexFive+1 && line.trim() !== 'uncompressed files:'){
                let indexOfColon = line.search(':');
                uncompressedFiles = line.slice(indexOfColon+1)
                console.log('Anzahl uncompressed Files' + uncompressedFiles);

            }
            if (index === indexFive + 2 && line.trim() !== 'compressed files:'){
                let indexOfColon = line.search(':');
                compressedFiles = line.slice(indexOfColon+1)
                console.log('Anzahl compressed Files' + compressedFiles);

            }
            if (line.trim()==='Load-004'){
                indexVier = index
            }

            if (index > indexVier && index < indexVier+3 && line.search('insert number')=== -1 && line.trim()!==''){
                numOfFiles = numOfFiles + line;
                console.log('Num of files----',numOfFiles)
                numOfAnswered += 1

            }
        });

    })
    return rawText

}

function generateAnalysisAnswer(){
    let answerSnippetOne = "Data Format: \nSource data format is refering to the original raw data format you will use for the upload to DISC. DISC is supporting simple text (.txt), comma seperated values (.csv), Extensible Markup Language (.xml), Oracle tables and many more.\n For a complete list of supported file formats visit Hyperlink\n\n";
    let answerSnippetTwo = "Data Compression: \nYou will probably upload your data in a compressed form to speed up the upload process. Please specify the compression format you will use. If you are not using any compression select \"none\"\n\n ";
    let answerSnippetThree = "Multipart Container:\nThese are the various parts of an archive. For example, one file can be divided into two ZIP-Containers: part one and part two.\n\n";
    let answerSnippetFour = "Number of Files:\nPlease specify the number of uncompressed files or the number of compressed file containers you will use";
    let fullAnswer = '';
    let answerPreMessage='';
    let counter = 0;
    
    console.log("start doc analysis");
    getIndices(filename);
    parseDoc(filename);
    if (numOfAnswered<4){
        answerPreMessage = 'I analysed your document and recognised that you have not answered the questions about '
        if (fileFormat.length===0){
            answerPreMessage = answerPreMessage + 'the file format '
            fullAnswer = fullAnswer + answerSnippetOne
            counter += 1
        }
        if (compression.length===0){
            if (counter ===0){
                answerPreMessage = answerPreMessage + 'the compression type '
            }else if (counter>0){
                answerPreMessage = answerPreMessage + 'and the compression type '
            }  
            fullAnswer = fullAnswer + answerSnippetTwo
            counter += 1
        }
        if (multiPartContainers.length===0){
            if (counter === 0){
                answerPreMessage = answerPreMessage + 'multipart-container '
            }else if (counter > 0){
                answerPreMessage = answerPreMessage + 'and multipart-container '
            }
            fullAnswer = fullAnswer + answerSnippetThree
            counter += 1
        }
        if (numOfFiles.length===0){
            if(counter === 0){            
                answerPreMessage = answerPreMessage + 'the amount of files '
            }else if (counter > 0){
                answerPreMessage = answerPreMessage + 'and the amount of files '
            }
            fullAnswer =  fullAnswer + answerSnippetFour
            counter += 1
        }
        fullAnswer = answerPreMessage + '\n\n' + fullAnswer

    } else if (numOfAnswered=4){
        fullAnswer = 'I analysed your document and saw that you have already answered every required question. Can I help you with anything else?'

    }
    return fullAnswer
    
}
exports.generateAnalysisAnswer = generateAnalysisAnswer

getIndices(filename);
parseDoc(filename);


