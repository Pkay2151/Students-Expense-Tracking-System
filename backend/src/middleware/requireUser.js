function cleanHeaderValue(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function requireUser(req, res, next) {
  const xUserId = cleanHeaderValue(req.header("x-user-id"));
  const xUserUid = cleanHeaderValue(req.header("x-user-uid"));
  const userId = xUserUid || xUserId;

  if (!userId) {
    return res.status(401).json({
      message: "Missing user identity. Send x-user-id or x-user-uid header.",
    });
  }

  req.userId = userId;
  req.user = {
    id: userId,
    email: cleanHeaderValue(req.header("x-user-email")),
    name: cleanHeaderValue(req.header("x-user-name")),
  };

  next();
}

module.exports = requireUser;
