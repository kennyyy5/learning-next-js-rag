import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function GET(req) {
    try {
        const loader = new PDFLoader("public/nike.pdf");
        const docs = await loader.load();

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const splits = await textSplitter.splitDocuments(docs);
        /*    const numberIds = generateNumberStrings(splits.length);

    let saveToPinecone = await vectorStore.addDocuments(splits, {
        ids: numberIds,
    }); */

        return Response.json(splits);
    } catch (error) {
        console.log(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}