import url from "url";
import type { NextApiRequest, NextApiResponse } from 'next';

import { verifySignature } from "@soundsright/utils";






export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { address, message, signature } = req.query;

  (async () => {

    try {

      const success = verifySignature(address as string, message as string, signature as string);

      res.status(200).json({ success, address });
    } catch (e) {
      res.status(200).json({ error: (e as Error).message });
    }
  })();
}
