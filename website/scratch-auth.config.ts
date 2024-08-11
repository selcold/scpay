import { ScratchAuth_config } from "scratch-auth-react/src/dist/config";

const config: ScratchAuth_config = {
  redirect_url: `http://localhost:3000/api/auth`,
  // redirect_url: `http://fun117-mac-mini.local:3000/api/auth`,
  title: `ScPay`,
  expiration: 30,
  newWindow: false,
};

export default config;
