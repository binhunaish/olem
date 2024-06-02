const showdown = require("showdown");

const converter = new showdown.Converter({
    tables: true,
    openLinksInNewWindow: true,
    customizedHeaderId: true,
    encodeEmails: true,
    literalMidWordUnderscores: true,
    simpleLineBreaks: true,
    splitAdjacentBlockquotes: true,
    strikethrough: true,
    tasklists: true,
    underline: true
});

module.exports = converter;