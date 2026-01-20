const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY || 'FYgWKZa4peRMlk3fydg44HdQqliyoOG2YGdJ3GMZ';
const PRINTFUL_API = 'https://api.printful.com';

// Map product types to Printful sync product IDs (these will be the IDs from your Printful store)
const PRODUCT_TYPE_MAP = {
  'T-Shirt': 'tshirt',
  'Hoodie': 'hoodie',
  'Sticker': 'sticker',
};

async function createPrintfulOrder(session) {
  try {
    const cart = JSON.parse(session.metadata.cart);
    const shippingInfo = JSON.parse(session.metadata.shippingInfo);
    const shippingAddress = session.shipping_details || session.customer_details;

    // Create Printful order
    const printfulOrder = {
      recipient: {
        name: shippingAddress.name || shippingInfo.name,
        address1: shippingAddress.address?.line1 || shippingInfo.address,
        address2: shippingAddress.address?.line2 || shippingInfo.address2 || '',
        city: shippingAddress.address?.city || shippingInfo.city,
        state_code: shippingAddress.address?.state || shippingInfo.state,
        country_code: shippingAddress.address?.country || shippingInfo.country || 'US',
        zip: shippingAddress.address?.postal_code || shippingInfo.zip,
        email: session.customer_email || shippingInfo.email,
      },
      items: cart.map(item => ({
        sync_variant_id: null, // Will be looked up from Printful store
        quantity: 1,
        retail_price: item.price.toFixed(2),
        name: `${item.design} - ${item.productType}`,
        // Note: You'll need to map these to actual Printful sync_variant_ids
        // For now, this creates a draft order that you can fulfill manually
      })),
      retail_costs: {
        currency: 'USD',
        subtotal: cart.reduce((sum, item) => sum + item.price, 0).toFixed(2),
        tax: '0.00',
        shipping: '0.00',
        total: cart.reduce((sum, item) => sum + item.price, 0).toFixed(2),
      },
    };

    const response = await axios.post(
      `${PRINTFUL_API}/orders`,
      printfulOrder,
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Printful order created:', response.data.result.id);
    return response.data.result;
  } catch (error) {
    console.error('❌ Error creating Printful order:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // For testing without webhook secret
      event = req.body;
    }
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      console.log('💳 Payment successful:', session.id);
      console.log('📧 Customer email:', session.customer_email);
      
      // Create Printful order
      try {
        await createPrintfulOrder(session);
        console.log('✅ Order fulfillment initiated');
      } catch (error) {
        console.error('❌ Failed to create Printful order:', error);
        // Don't fail the webhook - order was paid, we can fulfill manually if needed
      }
      
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
