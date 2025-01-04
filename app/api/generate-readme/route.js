import Groq from "groq-sdk";

// Function to generate README using GroqCloud API
export async function POST(req) {
    try {
        const { repoUrl, tone, wordLimit } = await req.json();
        // Retrieve API key from environment variables
        const apiKey = process.env.GROQ_API_KEY; // Accessing GroqCloud API Key from .env file

        // Initialize Groq API client
        const groq = new Groq({ apiKey: apiKey });

        // Function to call the GroqCloud API
        const generateReadmeFromAI = async () => {
            // Create a completion using the Groq API
            const completion = await groq.chat.completions
                .create({
                    messages: [
                        {
                            role: "user",
                            content: `Generate a detailed README for the following repository: ${repoUrl}. The tone should be ${tone}.`,
                        },
                    ],
                    model: "llama-3.3-70b-versatile",
                })
                .then((chatCompletion) => {
                    // Return the generated README content
                    return chatCompletion.choices[0]?.message?.content || "Error: Unable to generate README content";
                });
            return completion;
        };

        // Retry the request in case of quota exceeded (status 429)
        const readmeContent = await retryRequest(generateReadmeFromAI);

        // Apply the word limit
        const truncatedReadme = wordLimit
            ? readmeContent.split(' ').slice(0, wordLimit).join(' ')
            : readmeContent;

        // Return the generated README content
        return new Response(JSON.stringify({ readme: truncatedReadme }), { status: 200 });
    } catch (error) {
        console.error('Error generating README:', error);
        return new Response(JSON.stringify({ error: 'Error generating README' }), { status: 500 });
    }
}

// Retry function to handle quota exceeded (429 errors)
const retryRequest = async (fn, retries = 3, delay = 2000) => {
    try {
        return await fn();
    } catch (error) {
        if (error.response?.status === 429 && retries > 0) {
            console.log(`Quota exceeded. Retrying in ${delay / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return retryRequest(fn, retries - 1, delay * 2);
        } else {
            throw error;
        }
    }
};
