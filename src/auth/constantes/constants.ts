export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  signOptions: process.env.JWT_EXPIRES_IN,
};
