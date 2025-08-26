exports.handler = async function(event, context) {
    const userData = JSON.parse(event.body);

    // --- ⚠️ ACTION REQUIRED ---
    // PASTE YOUR DIGIO TEMPLATE ID HERE
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID_HERE';
    // --- ⚠️ ACTION REQUIRED ---

    const DIGIO_API_URL = 'https://api.digio.in/v2';
    const DIGIO_CLIENT_ID = process.env.DIGIO_CLIENT_ID;
    const DIGIO_CLIENT_SECRET = process.env.DIGIO_CLIENT_SECRET;
    const authHeader = 'Basic ' + Buffer.from(DIGIO_CLIENT_ID + ':' + DIGIO_CLIENT_SECRET).toString('base64');

    try {
        const response = await fetch(`${DIGIO_API_URL}/client/templates/${TEMPLATE_ID}/versions/latest/request`, {
            method: 'POST',
            headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "signers": [{ "identifier": userData.identifier, "name": userData.name, "reason": "Subscription Agreement" }],
                "expire_in_days": 1,
                // --- ⚠️ ACTION REQUIRED ---
                // We will update this URL after deploying to Netlify
                "post_sign_redirect_uri": "https://my-subscription-site.netlify.app/"
                // --- ⚠️ ACTION REQUIRED ---
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        return { statusCode: 200, body: JSON.stringify({ signing_url: data.signing_url }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

};
