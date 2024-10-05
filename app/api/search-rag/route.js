import { ChatOpenAI } from "@langchain/openai";
import {TavilySearchResults} from "@langchain/community/tools/tavily_search"
import dotenv from "dotenv"
dotenv.config()


export async function GET(req, route) {
    try {
        const { searchParams } = new URL(req.url);
       // console.log(searchParams)
        const query = searchParams.get("q");
        //console.log(query)
        if (!query) {
            return Response.json({ error: "Query parameter 'q' is required." }, { status: 400 });
        }

        const llm = new ChatOpenAI({
            modelName: "gpt-4-1106-preview",
             //maxOutputTokens: 2048,
            apiKey: process.env.OPENAI_API_KEY,
        });
        //console.log(llm)
        const search = new TavilySearchResults({
            maxResults: 10,
            apiKey: process.env.TAVILY_API_KEY,
        });
       //console.log(search)
     //  console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);
//console.log("Tavily API Key:", process.env.TAVILY_API_KEY);

        const searchResults = await search.invoke(query||"");
        console.log(searchResults)
        if (!searchResults || searchResults.length === 0) {
            return Response.json({ query, answer: "No context available.", sources: [] });
        }

        const prompt = ` You are an assistant for question-answering tasks. 
                         Use the following pieces of retrieved context to answer the question. 
                         If you don't know the answer,
                         just say that you don't know.
                          Question: "${query}"\n\nContext: "${searchResults}"\n\n Answer: `;

        const response = await llm.invoke((prompt));

        return Response.json({
            query,
            answer: response.content,
            sources: searchResults,
        });
    } catch (error) {
        console.error(error);
        return Response.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}