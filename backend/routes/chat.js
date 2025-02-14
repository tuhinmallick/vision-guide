// const express = require('express');
// const router = express.Router();
// require('dotenv').config();

// router.post('/chat', async (req, res) => {
//     const { prompt } = req.body;
//     const url = "https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";

//     console.log("Prompt:", prompt);
//     // Dynamic import for ES Module
//     const { default: fetch } = await import('node-fetch');

//     const headers = {
//         "Accept": "application/json",
//         "Content-Type": "application/json",
//         "Authorization": `${process.env.IBM_API_KEY}`
//     };
//     const body = {
//         input: prompt,
//         parameters: {
//             decoding_method: "greedy",
//             max_new_tokens: 900,
//             min_new_tokens: 0,
//             stop_sequences: [],
//             repetition_penalty: 1
//         },
//         model_id: "ibm/granite-13b-chat-v2",
//         project_id: "3e244f2a-5c1f-4cfa-ad52-a509c11b29d8",
//         moderations: {
//             hap: {
//                 input: {
//                     enabled: true,
//                     threshold: 0.5,
//                     mask: {
//                         remove_entity_value: true
//                     }
//                 },
//                 output: {
//                     enabled: true,
//                     threshold: 0.5,
//                     mask: {
//                         remove_entity_value: true
//                     }
//                 }
//             }
//         }
//     };

//     try {
//         const response = await fetch(url, {
//             headers,
//             method: "POST",
//             body: JSON.stringify(body)
//         });

//         if (!response.ok) {
//             const resultText = await response.text();
//             console.error(`Non-200 response: ${response.status} - ${response.statusText}`);
//             console.error(`Response body: ${resultText}`);
//             throw new Error(`Non-200 response: ${response.status} - ${response.statusText}`);
//         }

//         const result = await response.json();
//         res.json(result);
//     } catch (error) {
//         console.error("Error generating text:", error.message);
//         res.status(500).json({
//             error: "Error generating text.",
//             message: error.message,
//             stack: error.stack // Optional: Include stack trace for debugging
//         });
//     }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: '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' }); // Pass the API key here

router.post('/chat', async (req, res) => {
    const { prompt } = req.body;

    console.log("Prompt:", prompt);

    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "user",
                    "content": prompt // Use the prompt from the request
                }
            ],
            "model": "llama-3.1-70b-versatile",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });

        const responseMessage = chatCompletion.choices[0].message.content;

        console.log(responseMessage)

        res.json({ response: responseMessage });
    } catch (error) {
        console.error("Error generating text:", error.message);
        res.status(500).json({
            error: "Error generating text.",
            message: error.message,
            stack: error.stack // Optional: Include stack trace for debugging
        });
    }
});

module.exports = router;
