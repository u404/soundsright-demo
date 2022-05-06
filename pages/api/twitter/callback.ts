import url from "url";
import type { NextApiRequest, NextApiResponse } from 'next';
import { oauthTwitter } from "../../../libs/utils";

const accessTokenUrl = "https://api.twitter.com/oauth/access_token";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { oauth_token, oauth_verifier } = req.query;

  (async () => {
    const requestData = {
      url: accessTokenUrl,
      method: 'POST',
      data: {
        oauth_token,
        oauth_verifier,
      }
    };

    try {
      const response = await fetch(`${requestData.url}`, {
        method: requestData.method,
        body: JSON.stringify(requestData.data),
        headers: oauthTwitter().toHeader(oauthTwitter().authorize(requestData)) as any
      });
      const text = await response.text();
      const data = url.parse(`?${text}`, true).query;

      res.status(200).json({ ...data, oauth_token_old: oauth_token });
    } catch (e) {
      res.status(200).json({ error: (e as Error).message });
    }
  })();
}
