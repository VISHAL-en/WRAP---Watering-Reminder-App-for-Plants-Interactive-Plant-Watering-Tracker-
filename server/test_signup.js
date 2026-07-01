async function testSignup() {
    try {
        console.log('Attempting signup...');
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'debuguser_' + Date.now(),
                password: 'password123'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Signup Success:', data);
        } else {
            console.log('Signup Failed Status:', response.status);
            console.log('Signup Failed Data:', data);
        }
    } catch (err) {
        console.log('Fetch Error:', err.message);
    }
}

testSignup();
