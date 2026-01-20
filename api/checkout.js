const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cart, shippingInfo } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!shippingInfo || !shippingInfo.email || !shippingInfo.name || !shippingInfo.address) {
      return res.status(400).json({ error: 'Shipping information is required' });
    }

    // Create line items for Stripe
    const lineItems = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.design} - ${item.productType}`,
          description: `Color: ${item.color}, Size: ${item.size}`,
          images: [item.designImage ? `https://vercel-launch-of-synckaiden.vercel.app${item.designImage}` : undefined].filter(Boolean),
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: 1,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://vercel-launch-of-synckaiden.vercel.app'}/boutique/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://vercel-launch-of-synckaiden.vercel.app'}/boutique`,
      customer_email: shippingInfo.email,
      metadata: {
        cart: JSON.stringify(cart),
        shippingInfo: JSON.stringify(shippingInfo),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
};
