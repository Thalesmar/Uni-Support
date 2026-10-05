// One base URL for every frontend request.
// During `npm run dev`, Vite forwards `/api` to Express (see vite.config.js).
export const API_URL = import.meta.env.PROD
  ? "https://uni-support-eosin.vercel.app/api"
  : "/api";