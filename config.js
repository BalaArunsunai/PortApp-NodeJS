const tokenInfo = {
    secreteKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTUyMjU2NTksImp3dGlkIjoiOXlvejZmIiwiYXVkaWVuY2UiOiJURVNUIiwiZGF0YSI6e30sImV4cCI6MTU1NTIyOTI1OX0.5JDkEAyLEKnghMJ1lsTAy5OAa3hOxg4SkuMoiKXkwSI",
    tokenexp: "3600"
  };
  
  const server = {
    api: "/portApp/v1/api/",
    path: "./data/"
  };

  const mail = {
    port : 587,
    userEmail:'mamptl123@gmail.com',
    userMailPassword:'**********'
  }

  const Msg91 = {
    'sender'  : 'EYNOSM',
    'authkey' : '276617ARiYMFceVB5cda9dca',
  }
  
module.exports = {
    tokenInfo: tokenInfo,
    server: server,
    mail: mail,
    Msg91: Msg91
};
  