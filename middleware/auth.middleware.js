const jwt = require("jsonwebtoken");
const UserModel = require("../modals/user.model");

//It's my middleware checking if token exist or not
//if token exist after login it's ok else the funcion middleware return an error in this case you won't to log

module.exports.checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    return res.status(200).send("No token find");
  }
};

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(token);
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "No Token" });
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    return res.status(400).send("No token find");
  }
};

module.exports.authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;

  // Cas où le token est manquant
  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès non autorisé, token manquant" });
  }

  try {
    // Vérification du token
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Token expiré, veuillez vous reconnecter" });
      }

      // Si le token est valide
      console.log();
      const user = await UserModel.findById(decodedToken.userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Erreur lors de la vérification du token" });
  }
};
