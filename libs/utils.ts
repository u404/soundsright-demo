
import crypto from "crypto";
import OAuth from "oauth-1.0a";


export const oauthTwitter = (() => {
  let _oauth: OAuth;

  return () => {
    return _oauth;
  };
})();


export const browser = {

  getUA() {
    return window.navigator.userAgent;
  },

  isAndroid() {
    const ua = this.getUA();
    if (!!ua.match(/Safari/) && ua.match(/Android[\s/]([\d.]+)/)) {
      return true;
    }
    return false;
  },

  isIOS() {
    const ua = this.getUA();
    if (ua.match(/(iPhone|iPad|iPod)/)) {
      return true;
    }
    return false;
  }
};