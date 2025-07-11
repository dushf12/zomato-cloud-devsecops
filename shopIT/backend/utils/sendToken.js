// Create and send token and save in the cookie
export default(user, statusCode, res) => {

    // Create JWT token
    const token = user.getJwtToken();

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
        user,
    });
}