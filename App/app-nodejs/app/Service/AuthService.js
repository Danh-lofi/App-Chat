import jwt from "jsonwebtoken";
import util from "util";
const promisify = util.promisify;
/*
    - Hàm sign và verify của jwt là hàm callback
    --> util để hàm trả về 1 promise

*/
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

const AuthService = {
  generateToken: async (payload, secretSignature, tokenLife) => {
    try {
      return await sign(
        {
          payload,
        },
        secretSignature,
        {
          algorithm: "HS256",
          expiresIn: tokenLife,
        }
      );
    } catch (error) {
      console.log(`Error in generate access token: + ${error}`);
      return null;
    }
  },
};

export default AuthService;
