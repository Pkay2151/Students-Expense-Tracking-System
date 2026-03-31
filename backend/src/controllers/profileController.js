const { nanoid } = require("nanoid");

const Profile = require("../models/Profile");

const ALLOWED_CURRENCIES = new Set(["USD", "GHS", "EUR", "NGN", "KES", "GBP"]);

function cleanText(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function buildDefaultProfile(req) {
  return {
    id: nanoid(10),
    userId: req.userId,
    fullName: cleanText(req.user?.name),
    email: cleanText(req.user?.email).toLowerCase(),
    avatarUrl: "",
    currency: "GHS",
    preferences: {
      receiveBudgetAlerts: true,
    },
  };
}

function isValidEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidHttpUrl(value) {
  if (!value) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

async function getProfile(req, res, next) {
  try {
    let profile = await Profile.findOne({ userId: req.userId });

    if (!profile) {
      profile = await Profile.create(buildDefaultProfile(req));
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  const { fullName, email, avatarUrl, currency, preferences } = req.body || {};

  if (email !== undefined && !isValidEmail(cleanText(email).toLowerCase())) {
    return res.status(400).json({ message: "email must be a valid email address" });
  }

  if (avatarUrl !== undefined && !isValidHttpUrl(cleanText(avatarUrl))) {
    return res.status(400).json({ message: "avatarUrl must be a valid http or https URL" });
  }

  if (currency !== undefined) {
    const normalizedCurrency = cleanText(currency).toUpperCase();
    if (!ALLOWED_CURRENCIES.has(normalizedCurrency)) {
      return res.status(400).json({
        message: `currency must be one of: ${Array.from(ALLOWED_CURRENCIES).join(", ")}`,
      });
    }
  }

  if (
    preferences !== undefined &&
    (typeof preferences !== "object" || Array.isArray(preferences) || preferences === null)
  ) {
    return res.status(400).json({ message: "preferences must be an object" });
  }

  if (
    preferences &&
    Object.prototype.hasOwnProperty.call(preferences, "receiveBudgetAlerts") &&
    typeof preferences.receiveBudgetAlerts !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "preferences.receiveBudgetAlerts must be a boolean" });
  }

  try {
    let profile = await Profile.findOne({ userId: req.userId });

    if (!profile) {
      profile = await Profile.create(buildDefaultProfile(req));
    }

    if (fullName !== undefined) profile.fullName = cleanText(fullName);
    if (email !== undefined) profile.email = cleanText(email).toLowerCase();
    if (avatarUrl !== undefined) profile.avatarUrl = cleanText(avatarUrl);
    if (currency !== undefined) profile.currency = cleanText(currency).toUpperCase();
    if (preferences && Object.prototype.hasOwnProperty.call(preferences, "receiveBudgetAlerts")) {
      profile.preferences.receiveBudgetAlerts = preferences.receiveBudgetAlerts;
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
