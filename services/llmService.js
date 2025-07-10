/**
 * @fileoverview This file contains the service logic for interacting with the Hugging Face LLM
 * and performing web searches to provide up-to-date information.
 */

const axios = require('axios');
const { HfInference } = require('@huggingface/inference');
const cheerio = require('cheerio');

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Searches the web for a given query to fetch real-time information.
 * 
 * This function scrapes Google search results to provide current context for the LLM.
 * It specifically targets Indian government and policy sites to ensure relevance.
 * 
 * @param {string} query - The user's query to search for.
 * @returns {Promise<string>} A string containing the scraped web content, or an error message.
 */
async function searchWeb(query) {
  try {
    // Construct a Google search URL with specific site filters for Indian CA policies.
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' Indian CA policy site:*.in | site:*.gov.in -inurl:(login)')}`;
    const response = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }, // Use a standard user-agent to avoid blocking.
      timeout: 5000
    });

    // Parse the HTML response to extract search result links.
    const $ = cheerio.load(response.data);
    const links = $('a[href^="/url?q="]').slice(0, 3).map((_, el) => {
      const href = $(el).attr('href').split('&')[0].replace('/url?q=', '');
      return decodeURIComponent(href);
    }).get();

    // Scrape the content from the top 3 links.
    let webContent = '';
    for (const link of links) {
      const page = await axios.get(link, { timeout: 5000 });
      const $page = cheerio.load(page.data);
      const text = $page('p, h1, h2, h3').text().replace(/\s+/g, ' ').trim();
      webContent += text.slice(0, 1000) + '\n---\n'; // Append the first 1000 characters.
    }
    return webContent || 'No recent data found.';
  } catch (error) {
    console.error('Web scrape error:', error.message);
    return 'Couldn’t fetch latest data.';
  }
}

/**
 * Generates an intelligent response using the Hugging Face LLM.
 * 
 * This function takes a user's message, enriches it with real-time web content,
 * and then queries the Hugging Face chat completion API to get a response.
 * 
 * @param {string} message - The user's message from WhatsApp.
 * @returns {Promise<string>} The AI-generated response.
 * @throws {Error} If the API key is not set or if there is an API/network error.
 */
exports.getLLMResponse = async (message) => {
  // Check if mock response mode is enabled for testing.
  if (process.env.USE_MOCK_LLM === 'true') {
    return "This is a mock response.";
  }

  // Ensure the Hugging Face API key is configured.
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("HUGGINGFACE_API_KEY is not set");
  }

  try {
    // Fetch real-time web content to provide context to the LLM.
    const webContent = await searchWeb(message);
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Call the Hugging Face chat completion API with a detailed system prompt.
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
      
    return chatCompletion.choices[0].message.content;

  } catch (error) {
    // Robust error handling for API and network issues.
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
      return 'Sorry, I am having trouble connecting to my knowledge base. Please try again later. 😔';
    } else if (error.request) {
      console.error("Network Error:", error.message);
      return 'Sorry, I am having trouble with my connection. Please try again later. 😔';
    } else {
      console.error("Unexpected Error:", error.message);
      return 'An unexpected error occurred. Please try again later. 😔';
    }
  }
};