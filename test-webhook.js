// Replace 'sk_test_...' with your test secret key
const stripe = require('stripe')('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');

async function testWebhook() {
  try {
    // Create a test PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        test: 'true'
      }
    });

    console.log('Created PaymentIntent:', paymentIntent.id);

    // Confirm the PaymentIntent using a test card
    const confirmedIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method: 'pm_card_visa' // Test card token
      }
    );

    console.log('Confirmed PaymentIntent:', confirmedIntent.status);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testWebhook(); 