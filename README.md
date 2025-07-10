# CA-Chatbot

A powerful and intelligent WhatsApp chatbot powered by Node.js, Express, and Hugging Face.

## Key Features

- **WhatsApp Integration**: Connects with the Twilio API to send and receive messages on WhatsApp.
- **AI-Powered Responses**: Utilizes Hugging Face's inference API to generate intelligent and contextual responses.
- **Real-Time Communication**: Built with Socket.io for potential real-time features.
- **Extensible and Modular**: Organized into a clean structure with routes, controllers, and services.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Messaging**: Twilio, Socket.io
- **AI & NLP**: Hugging Face Inference API
- **APIs & Services**: Google APIs, SerpApi for search integration
- **Utilities**: Axios, Cheerio, Winston (for logging), Dotenv (for environment variables)
- **Testing**: Mocha, Chai

## Installation & Setup

Follow these steps to get the project running locally:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd wachatbot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root of the project and add the necessary environment variables. You will need credentials for Twilio, Hugging Face, and any other services you are using.
    ```env
    # Twilio Credentials
    TWILIO_ACCOUNT_SID=
    TWILIO_AUTH_TOKEN=
    TWILIO_WHATSAPP_NUMBER=

    # Hugging Face API Key
    HUGGINGFACE_API_KEY=

    # SerpApi Key
    SERPAPI_API_KEY=

    # Google API Credentials (if used)
    GOOGLE_API_KEY=
    ```

## Usage

1.  **Start the application:**
    ```bash
    node server.js
    ```

2.  The server will start on `http://localhost:3000`.

3.  To receive WhatsApp messages, configure your Twilio sandbox to send a webhook to `http://<your-ngrok-url>/` where the server is running.

## License

This project is licensed under the **ISC License**. See the `LICENSE` file for more details.

## Author

- **[Your Name]** - [Your Contact Info]
