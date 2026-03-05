import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const { email } = await request.json();

	if (!email) {
		return NextResponse.json({ error: 'Email is required' }, { status: 400 });
	}

	// TODO: Save to database or Mailchimp

	return NextResponse.json({ message: 'Subscribed successfully' });
}
