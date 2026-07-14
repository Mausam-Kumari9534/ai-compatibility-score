const testAuth = async () => {
    try {
        console.log("1. Testing Registration...");
        const email = `test${Date.now()}@example.com`;
        
        let registerRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Test User',
                email: email,
                password: 'password123'
            })
        });
        registerRes = await registerRes.json();
        console.log("Registration Successful:", registerRes.success, "Token:", !!registerRes.token);

        console.log("\n2. Testing Login...");
        let loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: 'password123'
            })
        });
        loginRes = await loginRes.json();
        console.log("Login Successful:", loginRes.success, "Token:", !!loginRes.token);
        
        const token = loginRes.token;

        console.log("\n3. Testing Protected Route (Profile)...");
        let profileRes = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        profileRes = await profileRes.json();
        console.log("Profile Fetch Successful:", profileRes.success, "User:", profileRes.user.email);
        
        console.log("\nAll tests passed successfully!");
    } catch (error) {
        console.error("Test failed:", error);
    }
};

testAuth();
