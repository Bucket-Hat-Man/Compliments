// api/generateCompliment.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' });
      return;
    }
  
    const { userInput } = req.body;
  
    const data = {
      model: 'command-xlarge-nightly',
      prompt: `Generate a kind, funny and unique compliment for the following answer to the question What's your name and why do you need a compliment today?: ${userInput}`,
      max_tokens: 50,
      temperature: 0.7,
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
  
      const result = await response.json();
  
      if (result && result.generations && result.generations.length > 0) {
        res.status(200).json({ compliment: result.generations[0].text });
      } else {
        res.status(500).json({ message: 'Sorry, something went wrong. Please try again.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Sorry, something went wrong. Please try again.' });
    }
  }
  