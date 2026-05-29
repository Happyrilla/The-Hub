// pages/api/gamer.js
export default function handler(req, res) {
  const value = process.env.skomp;
  res.status(200).json({ value });
}
