import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const apiKey = process.env.ALPHA_VANTAGE_KEY || process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;

    if (!ticker) {
        return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    if (!apiKey) {
        return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    try {
        // symbols for Indian stocks usually need .BSE or .NSE
        // We try both if one fails, or just default to .NSE
        const symbol = ticker.includes('.') ? ticker : `${ticker}.NSE`;

        const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
            { next: { revalidate: 60 } } // Cache for 1 minute
        );

        const data = await response.json();

        if (data['Note']) {
            return NextResponse.json({ error: 'API limit reached', note: data['Note'] }, { status: 429 });
        }

        if (data['Global Quote']) {
            const quote = data['Global Quote'];
            return NextResponse.json({
                ticker: ticker,
                price: parseFloat(quote['05. price']),
                change: parseFloat(quote['09. change']),
                changePercent: quote['10. change percent'],
                volume: quote['06. volume'],
                lastUpdated: new Date().toISOString()
            });
        }

        return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 });
    }
}
