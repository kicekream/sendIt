import jwt from "jsonwebtoken";

function generateAuthToken(data) {
  const token = jwt.sign(
    {
      user_id: data.user_id,
      email: data.email,
      isAdmin: data.isadmin,
    },
    process.env.jwtPrivateKey
  );
  return token;
}

export { generateAuthToken };
