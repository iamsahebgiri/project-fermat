import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(429).json({
    message: "You reuqest is rate limited, try after 10 seconds.",
    success: false,
  });
  return res.end();
}
