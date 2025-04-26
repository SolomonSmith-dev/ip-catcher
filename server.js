const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ip = rawIp.split(',')[0].trim();
    console.log(`Visitor IP: ${ip}`);

    let locationInfo = 'Unknown Location';
    try {
        const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
        if (geoRes.data && geoRes.data.city && geoRes.data.region) {
            locationInfo = `${geoRes.data.city}, ${geoRes.data.region}`;
        }
    } catch (err) {
        console.error('Geo lookup failed:', err.message);
    }

    fs.appendFileSync('ips.txt', `${new Date().toISOString()} - ${ip} - ${locationInfo}\n`);

    res.send(`
        <html>
            <head>
                <title>Oops</title>
                <meta http-equiv="refresh" content="7;url=https://www.youtube.com/watch?v=dQw4w9WgXcQ">
            </head>
            <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
                <h1>You shouldn’t open every link…</h1>
                <h2>Your IP address is now <u>Our</u> IP address.</h2>
                <p style="margin-top: 30px;">Detected IP Address: <b>${ip}</b></p>
                <p>Location (approx): <b>${locationInfo}</b></p>
                <p style="font-size:12px; margin-top: 50px;">By accessing this page, you consent to harmless IP collection for entertainment purposes only.</p>
            </body>
        </html>
    `);
    
    
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

