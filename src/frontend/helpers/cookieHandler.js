const cookieHandler = (cookies) => {
  return {
    setAccessTokenCookie(accessToken) {
      cookies.set("spotify_access_token", accessToken.value, {
        expires: accessToken.expiresIn + "s",
        path: "/"
      });
    },
    isAccessTokenCookieSet() {
      return Boolean(
        cookies.get("spotify_access_token") &&
          cookies.get("spotify_access_token").length > 0
      );
    },

    getAccessToken() {
      return cookies.get("spotify_access_token");
    }
  };
};

export { cookieHandler };
