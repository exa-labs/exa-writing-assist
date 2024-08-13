"use server";
import Exa from "exa-js";

export default async function callExaSearcher(conversationState: string) {
    const exa = new Exa(process.env.EXA_API_KEY)
    
    let exaQuery = conversationState.length > 1000 
    ? (conversationState.slice(-1000))+"\n\nIf you found the above interesting, here's another useful resource to read:"
    : conversationState+"\n\nIf you found the above interesting, here's another useful resource to read:"

    let exaReturnedResults = await exa.searchAndContents(
        exaQuery,
        {
          type: "neural",
          useAutoprompt: false,
          numResults: 10,
          highlights: {
            numSentences: 1,
            highlightsPerUrl: 1
          }
        }
      )

    function formatCases(unparsedResults) {
        let formattedString = "";
        unparsedResults.results.forEach((item, index) => {
            const title = `CITATION TITLE ${index}:\n ${item.title}`;
            const detail = `CITATION DETAIL ${index}:\n ${item.highlights.join(" ")}`;
            const author = `CITATION AUTHOR ${index}:\n ${item.author}`;
            const url = `CITATION URL ${index}:\n ${item.url}`;

            formattedString += `${title}, ${detail}, ${author}, ${url};\n `;
        });
        return formattedString;
    }

    let parsedExaResults = formatCases(exaReturnedResults)
    console.log(parsedExaResults)

	return parsedExaResults
}
