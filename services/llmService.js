// services/llmService.js

const axios = require('axios');
const { HfInference } = require('@huggingface/inference');
//Searching the web page
const { search } = require('serpapi');

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Web search function for latest data
// Web search function using SerpAPI

const cheerio = require('cheerio');

async function searchWeb(query) {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + 'Indian CA policy site:*.in | site:*.gov.in -inurl:(login)')}`;
    const response = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000
    });
    const $ = cheerio.load(response.data);
    const links = $('a[href^="/url?q="]').slice(0, 3).map((_, el) => {
      const href = $(el).attr('href').split('&')[0].replace('/url?q=', '');
      return decodeURIComponent(href);
    }).get();

    let webContent = '';
    for (const link of links) {
      const page = await axios.get(link, { timeout: 5000 });
      const $page = cheerio.load(page.data);
      const text = $page('p, h1, h2, h3').text().replace(/\s+/g, ' ').trim();
      webContent += text.slice(0, 1000) + '\n---\n';
    }
    return webContent || 'No recent data found.';
  } catch (error) {
    console.error('Web scrape error:', error.message);
    return 'Couldn’t fetch latest data.';
  }
}
exports.getLLMResponse = async (message) => {
  // Check if mock response is enabled
  if (process.env.USE_MOCK_LLM === 'true') {
    return "This is a mock response.";
  }

  // Validate environment variable for API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  // Make API call with error handling
  try {
    const webContent = await searchWeb(message);
    const currentDate = 'February 27, 2025';    
    const chatCompletion = await client.chatCompletion({
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
            {
                role: 'system',
                content: `You are a professional from an Indian Chartered Accountant (CA) firm, assisting clients via WhatsApp. Your expertise is limited to Indian accounting, taxation, auditing, and financial regulations (e.g., Income Tax Act, GST, Companies Act).Incorporate web content for facts as of ${currentDate}. Do NOT use knowledge, facts, or rules from any other country—focus only on India. Keep responses concise (under 900 characters), clear, and engaging. Use bullet points (-), emojis (e.g., 📅, 💰, ✅), and a friendly tone. Avoid long paragraphs; format replies like quick WhatsApp messages.`
            },
            {
            role: "user",
            content:`Query: ${message}\nWeb Content: ${webContent}`
          }
        ],
        max_tokens: 350,
      });
      
      console.log(chatCompletion.choices[0].message.content.length)
    return chatCompletion.choices[0].message.content;
      
    

    // Validate response structure
    // if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
    //   throw new Error("Invalid response structure from API");
    // }

    // Return the message content
    // return response.data.choices[0].message.content;
    
    
  } catch (error) {
    // Handle API errors (e.g., 429, 401)
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
      throw new Error(`API Error: ${error.response.data.error.message}`);
      return 'Sorry, can’t help now! 😔';
    }
    // Handle network errors (e.g., no response from server)
    else if (error.request) {
      console.error("Network Error:", error.message);
      throw new Error("Network error occurred. Please try again later.");
      return 'Sorry, can’t help now! 😔';
    }
    // Handle other unexpected errors
    else {
      console.error("Unexpected Error:", error.message);
      throw error;
      return 'Sorry, can’t help now! 😔';
    }
  }
};