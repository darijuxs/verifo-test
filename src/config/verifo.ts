import { registerAs } from '@nestjs/config';

export default registerAs('verifo', () => ({

  name:"verifo",
  api_key: process.env.VERIFO_API_KEY,
  api_secret:process.env.VERIFO_API_SECRET,
  api_version:process.env.VERIFO_API_VERSION,
  api_url:process.env.VERIFO_API_URL,
  api_domain:process.env.VERIFO_API_DOMAIN
}));