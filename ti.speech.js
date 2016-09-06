var SFSpeechRecognizer = require("Speech/SFSpeechRecognizer"),
    SFSpeechURLRecognitionRequest = require("Speech/SFSpeechURLRecognitionRequest"),
    NSLocale = require("Foundation/NSLocale"),
    NSBundle = require("Foundation/NSBundle"),
    NSURL = require("Foundation/NSURL"),
    speechRecognizer,
    SOURCE_TYPE_URL,
    SOURCE_TYPE_MICROPHONE;

(function constructor() {
    exports.SOURCE_TYPE_URL = SOURCE_TYPE_URL = "url";
    exports.SOURCE_TYPE_MICROPHONE = SOURCE_TYPE_MICROPHONE = "microphone";
})();

exports.initialize = function(locale) {
    if (speechRecognizer) {
        speechRecognizer = null;
        delete speechRecognizer;
    }

    speechRecognizer = SFSpeechRecognizer.alloc().initWithLocale(NSLocale.alloc().initWithLocaleIdentifier(locale));
};

exports.isSupported = function() {
    return speechRecognizer && speechRecognizer.isAvailable === true;
};

exports.recognize = function(args) {
    var type = args.type || SOURCE_TYPE_URL;
    var progressCallback = args.progress || null;

    if (!progressCallback) {
        Ti.API.error("No \"progress\" callback supplied - You will not be notified about transcription updates").
    }

    if (type == SOURCE_TYPE_URL) {
        var url = args.url.split("."); // Keep it for now: Split into filename and extension
        var request = SFSpeechURLRecognitionRequest.alloc().initWithURL(NSURL.fileURLWithPath(NSBundle.mainBundle().pathForResourceOfType(url[0], url[1])));

        speechRecognizer.recognitionTaskWithRequestResultHandler(request, function(result, error) {
            progressCallback({
                value: result.bestTranscription.formattedString,
            });
        });
    } else if (type == SOURCE_TYPE_MICROPHONE) {
        // TODO: Handle microphone input
        Ti.API.error("Microphone-inputs are not exposed, yet!");
    } else {
        Ti.API.error("Unhandled type supplied:" + type);
    }
};