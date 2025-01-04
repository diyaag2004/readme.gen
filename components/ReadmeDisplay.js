import ReactMarkdown from "react-markdown";
import { Octokit } from "octokit";
import { Configuration, OpenAIApi } from "openai";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const ReadmeDisplay = ({ readme }) => {
  const downloadReadme = () => {
    const blob = new Blob([readme], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "README.md";
    link.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mt-6">
      <h2 className="text-xl font-bold mb-4">Generated README</h2>
      <div className="prose">
        <ReactMarkdown>{readme}</ReactMarkdown>
      </div>
      <button
        onClick={downloadReadme}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Download README
      </button>
      
    </div>
  );
};

export default ReadmeDisplay;
