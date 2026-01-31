const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Get Token
    const token = req.header('Authorization');

    // 2. Check if token exists
    if (!token) {
        return res.status(401).json({ error: "Access Denied. No Token." });
    }

    try {
        // 3. Clean Token ("Bearer " removal)
        // If the token comes as "Bearer eyJ...", we remove the first 7 chars.
        // If it comes as just "eyJ...", we keep it.
        const tokenString = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;

        // 4. Verify Token
        // CRITICAL: We use process.env.JWT_SECRET or fallback for safety
        const secret = process.env.JWT_SECRET || "rishit_secret_key_123";
        const verified = jwt.verify(tokenString, secret);

        // 5. ATTACH USER TO REQUEST (This is the missing link!)
        req.user = verified; 
        
        next(); // Pass to the next handler
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

module.exports = authMiddleware;