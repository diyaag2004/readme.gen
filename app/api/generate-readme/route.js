import { Octokit } from '@octokit/rest';

const retryRequest = async (fn, retries = 3, delay = 2000) => {
  try {
    return await fn();
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.log(`Quota exceeded. Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay);
    }
    console.error('Error during request:', error);
    throw error;
  }
};

export async function POST(req) {
  try {
    const { repoUrl, tone } = await req.json();
    const repoParts = repoUrl.split('/');
    const owner = repoParts[3];
    const repoName = repoParts[4];

    // Initialize GitHub API
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // Fetch repository details from GitHub
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo: repoName,
    });

    // Prepare the prompt for Hugging Face API
    const prompt = `Generate a README for a GitHub repo: ${repoData.full_name}, with tone: ${tone}. Description: ${repoData.description}`;

    // Call Hugging Face API
    const response = await retryRequest(() =>
      fetch('https://api-inference.huggingface.co/models/gpt2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      })
    );

    // Parse the response from Hugging Face
    const data = await response.json();

    // Log the response to check its structure
    console.log('Hugging Face API response:', data);

    // Check if generated_text exists in the response
    if (data && data[0] && data[0].generated_text) {
      return new Response(JSON.stringify({ readme: data[0].generated_text }), { status: 200 });
    } else if (data && data.error) {
      console.error('Error from Hugging Face API:', data.error);
      return new Response(JSON.stringify({ error: `Error from Hugging Face: ${data.error}` }), { status: 500 });
    } else {
      console.error('Unexpected response format:', data);
      return new Response(JSON.stringify({ error: 'Unexpected response format' }), { status: 500 });
    }
  } catch (error) {
    console.error('Error generating README:', error);
    return new Response(JSON.stringify({ error: 'Error generating README' }), { status: 500 });
  }
}
