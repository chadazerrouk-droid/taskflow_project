const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // ⚠️ MODE TEST TEMPORAIRE POUR J3
  // Accepte tous les tokens ou l'absence de token
  // À SUPPRIMER quand l'auth finale sera prête

  const authHeader = req.headers.authorization;

  // Mode test : on accepte tout le monde
  console.log("🔓 Mode test - authentification désactivée");
  req.user = {
    id: "test-user-id",
    fullName: "Test User",
    role: "member",
  };

  return next();
};
