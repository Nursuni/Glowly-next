import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { message } = req.body;

	const completion = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content: 'You are a beauty assistant. Recommend skincare and makeup products with tips.',
			},
			{ role: 'user', content: message },
		],
		temperature: 0.7,
	});

	res.status(200).json({ reply: completion.choices[0].message.content });
}
