

async function testBadge() {
    const username = 'badgetest_' + Date.now();
    const password = 'password123';
    const baseUrl = 'http://127.0.0.1:5000/api';

    console.log(`1. Registering user: ${username}`);
    const regRes = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const regData = await regRes.json();
    console.log('Register response:', regData);

    if (!regData.token) {
        console.error('Registration failed');
        return;
    }
    const token = regData.token;

    console.log('2. Watering plant...');
    const waterRes = await fetch(`${baseUrl}/water`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    });
    const waterData = await waterRes.json();
    console.log('Water response:', JSON.stringify(waterData, null, 2));

    if (waterData.badges && waterData.badges.find(b => b.id === 'first_water')) {
        console.log('SUCCESS: First Water badge received!');
    } else {
        console.log('FAILURE: Badge not received.');
    }
}

testBadge();
