// Example Tebex webhook receiver (Express).
// NOTE: Adapt to Tebex webhook shape and security model; this example logs incoming events.
// Install: npm i express body-parser
// Run: node tebex-webhook-example.js
//
// In your Tebex control panel, set the webhook URL to https://your-server.com/tebex/webhook
// and configure any secret/signature options Tebex provides. Then implement verification below.

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Replace with your own verification if Tebex provides a signature header or secret
function verifyTebexRequest(req) {
  // Tebex may provide a signature header (check their docs).
  // For now this is a placeholder that always returns true.
  return true;
}

app.post('/tebex/webhook', (req, res) => {
  try {
    if (!verifyTebexRequest(req)) {
      console.warn('Tebex webhook verification failed');
      return res.status(401).send('invalid signature');
    }

    const event = req.body;
    console.log('Received Tebex webhook:', JSON.stringify(event, null, 2));

    // Example: event.action might be "purchase", check the exact payload in Tebex docs.
    // On a successful purchase, grant the rank/pack in your server:
    // - Identify the purchased package from event.data.package or event.data.package_id
    // - Identify player IGN from event.data.player or metadata
    // - Call your server console / permissions plugin / database to grant the rank
    //
    // This is pseudocode:
    // if (event.action === 'purchase') {
    //   const pkg = event.data.package.identifier;
    //   const player = event.data.player.name || event.data.metadata.ign;
    //   grantItemToPlayer(pkg, player);
    // }

    // Return 200 OK to acknowledge
    res.status(200).send('ok');
  } catch (err) {
    console.error('Webhook processing error', err);
    res.status(500).send('server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Tebex webhook example listening on port ${PORT}`));