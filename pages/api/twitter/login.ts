import fetch from "node-fetch";
import url from "url";
import type { NextApiRequest, NextApiResponse } from 'next';
import { oauthTwitter } from "../../../libs/utils";


const tokenUrl = 'https://api.twitter.com/oauth/request_token';
const authUrl = "https://api.twitter.com/oauth/authenticate";


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { redirect } = req.query;

  (async () => {

    const requestData = {
      url: tokenUrl,
      method: 'POST',
      data: {
        oauth_callback: redirect
      }
    };

    try {
      const response = await fetch(requestData.url, {
        method: requestData.method,
        body: JSON.stringify(requestData.data),
        headers: oauthTwitter().toHeader(oauthTwitter().authorize(requestData)) as any
      });
      const text = await response.text();
      const { oauth_token, oauth_token_secret, oauth_callback_confirmed } = url.parse(`?${text}`, true).query;



      if (oauth_callback_confirmed !== "true") {
        throw new Error("Missing `oauth_callback_confirmed` parameter in response (is the callback URL approved for this client application?)");
      }

      res.redirect(`${authUrl}?oauth_token=${oauth_token}`);
    } catch (e) {
      res.redirect(`${redirect}?error=${(e as Error).message}`);
    }
  })();
}
