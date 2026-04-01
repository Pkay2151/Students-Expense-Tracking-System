function getHealth(req, res) {
  res.json({
    status: "ok",
    service: "students-expense-tracking-backend",
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  getHealth,
};
