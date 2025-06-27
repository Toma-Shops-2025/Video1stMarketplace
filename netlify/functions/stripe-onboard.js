const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { userId, email } = JSON.parse(event.body);
    if (!userId || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing userId or email' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    // Create a Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      metadata: { userId },
    });
    // Create an onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://tomashops.com/sell',
      return_url: 'https://tomashops.com/sell',
      type: 'account_onboarding',
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ accountLink: accountLink.url, accountId: account.id }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message, stack: err.stack }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
}; 