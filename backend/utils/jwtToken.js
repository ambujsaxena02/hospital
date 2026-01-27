export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  
  // FIX: These settings are MANDATORY for Vercel (Frontend) + Render (Backend)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,      // Required: Must be true for HTTPS/Production
    sameSite: "None",  // Required: Allows cross-site cookie sharing
  };

  res.status(statusCode).cookie("patientToken", token, cookieOptions).json({
    success: true,
    message,
    user,
    token,
  });
};