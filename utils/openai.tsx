"use server";

import OpenAI from "openai";
const openai = new OpenAI();

const systemPrompt = `You are an essay-completion bot that continues/completes a sentence given some input stub of an essay/prose. You only complete 1-2 SHORT sentence MAX. If you get an input of a half sentence or similar, DO NOT repeat any of the preceding text of the prose. THIS MEANS DO NOT INCLUDE THE STARTS OF INCOMPLETE SENTENCES IN YOUR RESPONSE. This is also the case when there is a spelling, punctuation, capitalization or other error in the starter stub - e.g.:

USER INPUT: pokemon is a
YOUR CORRECT OUTPUT: Japanese franchise created by Satoshi Tajiri.
NEVER/INCORRECT: Pokémon is a Japanese franchise created by Satoshi Tajiri.

USER INPUT: Once upon a time there
YOUR CORRECT OUTPUT: was a princess.
NEVER/INCORRECT: Once upon a time, there was a princess.

USER INPUT: Colonial england was a
YOUR CORRECT OUTPUT: time of great change and upheaval.
NEVER/INCORRECT: Colonial England was a time of great change and upheaval.

USER INPUT: The fog in san francisco
YOUR CORRECT OUTPUT: is a defining characteristic of the city's climate.
NEVER/INCORRECT: The fog in San Francisco is a defining characteristic of the city's climate.

USER INPUT: The fog in san francisco
YOUR CORRECT OUTPUT: is a defining characteristic of the city's climate.
NEVER/INCORRECT: The fog in San Francisco is a defining characteristic of the city's climate.

 Once you have made one citation, STOP GENERATING. BE PITHY. Where there is a full sentence fed in, you should continue on the next sentence as a generally good flowing essay would. You have a specialty in including content that is cited. Given the following two items, (1) citation context and (2) current essay writing, continue on the essay or prose inputting in-line citations in parentheses with the author's name, right after that followed by the relevant URL in square brackets. THEN put a parentheses around all of the above. If you cannot find an author (sometimes it is empty), use the generic name 'Source'. Example citation for you to follow the structure of: ((AUTHOR_X, 2021)[URL_X]). If there are more than 3 author names to include, use the first author name plus 'et al'`

// Claude API call (no official SDK)
async function callClaude(exaResults: string, conversationState: string) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 200,
        system: systemPrompt,
        messages: [
          { role: 'user', content: exaResults + ' \n CONVERSATION INPUT:' + conversationState },

        ]
      })
    });
  
    const data = await response.json();

    console.log(exaResults + ' \n CONVERSATION INPUT:' + conversationState)
    console.log(data);
    return data
  }

export default async function callOpenAi(exaResults: string, conversationState: string) {


  // deprecated - moved from OAI to Anthropic
  
	// let messages = [
    //     { role: "system", content: systemPrompt},
    //     {role: 'user', content: exaResults},
    //     {role: "user", content: conversationState }
    // ]

	// const completion = await openai.chat.completions.create({
    //     //@ts-expect-error
    //     messages: messages,
	// 	model: "gpt-4o",
    //     max_tokens:100 // Limit the response to around 2 short sentences
	// });

	// console.dir(completion.choices[0]);

	// return completion.choices[0]

    const claudeResponse = await callClaude(exaResults, conversationState);

    // const claudeData = await claudeResponse;

    console.log(claudeResponse);

    return claudeResponse.content[0];

}
