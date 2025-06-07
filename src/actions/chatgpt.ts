'use sever';

import OpenAI from 'openai'

export const generateCreativePrompt = async (userPrompt: string) => {

    const openai = new OpenAI({
        apiKey:process.env.OPENAI_API_KEY,


    })

    const finalPrompt = `
        Create a coherent and relavant outline for the following prompt:
        ${userPrompt}.
        The outline should be consist of at least 6 points, which each point written as a single sentence.
        Ensure tha outline is well-structured and directly related to the topic.
        Return the output in the following JSON format:

        {
        "outlines": [
        "point 1",
        "point 2",
        "point 3",
        "point 4",
        "point 5",
        "point 6"
        ]
        }

        Ensure that the JSON is valid and properly formatted. Do not include any other text or explanations.
        outside the JSON. 
    `

    try {

    const completion = await openai.chat.completions.create({
        model: 'chatgpt-4o-latest',
        messages: [
            {
                role: 'system',
                content:
                'You are a helpful AI that generates outlines for presentations'
            },
            {
                role: 'user',
                content: finalPrompt,
            },
        ],

        max_tokens:1000,
        temperature:0.0,
    })

    const responseContent = completion.choices[0].message?.content
        if(responseContent){
            try {
                const jsonResponse = JSON.parse(responseContent)
                return {
                    status:200,
                    data: jsonResponse
                }
            } catch (error) {
                console.log('Invalid JSON received', responseContent,error)
                return{
                    status:500,
                    error: 'Invalid JSON received',
                }
            }
        }

        return {
            status:400,
            error: 'No response received',
        }

    } catch (error) {
        console.error('Error generating creative prompt:', error);
        return {
            status: 500,
            message: 'Internal server error',
        };
        
    }
}