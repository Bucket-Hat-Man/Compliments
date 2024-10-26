// api/generateCompliment.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }

    const { userInput, promptStyle } = req.body;

    // Debugging - Check if API key is accessible
    if (!process.env.COHERE_API_KEY) {
        console.error("API Key not found. Please check environment variable configuration.");
        res.status(500).send({ message: 'API key not found. Please check environment variable configuration.' });
        return;
    }

    console.log("API Key found. Proceeding with request...");

    const data = {
        model: 'command-xlarge-nightly',
        prompt: `Generate a kind, funny and unique compliment. ${promptStyle} Answer: What's your name and why do you need a compliment today?: ${userInput}`,
        max_tokens: 80,
        temperature: 0.8, // Increased temperature for more varied output
    };

    try {
        const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Cohere API response not OK:", response.status, response.statusText);
            res.status(500).json({ message: `Cohere API request failed with status: ${response.status} ${response.statusText}` });
            return;
        }

        const result = await response.json();

        if (result && result.generations && result.generations.length > 0) {
            res.status(200).json({ compliment: result.generations[0].text });
        } else {
            console.error("Cohere API did not return expected results:", result);
            res.status(500).json({ message: 'Sorry, something went wrong. Please try again.' });
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        res.status(500).json({ message: 'Sorry, something went wrong. Please try again.' });
    }
}
