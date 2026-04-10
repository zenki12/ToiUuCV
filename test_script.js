const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const fs = require('fs');

async function test() {
    console.log("1. Testing pdf-parse:");
    console.log("pdfParse type:", typeof pdfParse);
    console.log("pdfParse:", pdfParse);
    if (typeof pdfParse === 'object') {
        console.log("pdfParse.default type:", typeof pdfParse.default);
        console.log("pdfParse.default:", pdfParse.default);
    }
    
    console.log("\n2. Testing Gemini Models:");
    const apiKey = 'AIzaSyDxPlQBmDfuyVuYTltNvhtiUJ1KDVjibiA';
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
        console.log("Listing models...");
        const response = await genAI.getModels ? await genAI.getModels() : (await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`).then(r => r.json()));
        console.log("Available models:");
        if (response.models) {
             console.log(response.models.map(m => m.name).join("\n"));
        } else {
             console.log(response);
        }
    } catch(err) {
        console.error("Error listing models:", err.message);
    }
}

test();
