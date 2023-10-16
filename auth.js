const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  console.log(request.headers.authorization);
  try {
    const token = await request.headers.authorization;
    const decodedToken = jwt.verify(token, "secret");
    console.log(decodedToken);
    request.decodedToken = decodedToken;
    next();
  } catch (error) {
    response.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
