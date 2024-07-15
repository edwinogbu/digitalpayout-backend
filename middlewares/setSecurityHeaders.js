// Middleware function to set security headers in HTTP responses
const setSecurityHeaders = (req, res, next) => {
    // Set Content Security Policy (CSP) header to mitigate XSS attacks
    res.setHeader('Content-Security-Policy', "default-src 'self'");

    // Set X-Content-Type-Options header to prevent MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Set X-Frame-Options header to defend against clickjacking attacks
    res.setHeader('X-Frame-Options', 'DENY');

    // Set X-XSS-Protection header to enable the browser's built-in XSS protection mechanism
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Proceed to the next middleware or handler
    next();
};

module.exports = setSecurityHeaders;
