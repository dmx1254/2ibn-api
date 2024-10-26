const UserModel = require("../modals/user.model");
const CodeModel = require("../modals/code.models");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

//All my errors functions displaying when sign in or sign up errors
const { signUpErrors, signInErrors } = require("../utils/errors.utils");

//Define duration of the valid token
const maxAge = 3 * 24 * 60 * 60 * 1000;

//Function creating token with json web token
const createToken = (id, admin) => {
  return jwt.sign({ id, admin }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

//Users creating and saving in my database function
module.exports.signUp = async (req, res) => {
  const {
    email,
    password,
    code,
    isAdmin,
    moderator,
    profil,
    lastname,
    firstname,
    phone,
    address,
    country,
    city,
    postalCode,
  } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(500)
        .json({ userError: "This user with this email is already registered" });
    } else {
      await UserModel.create({
        email,
        password,
        isAdmin,
        moderator,
        profil,
        lastname,
        firstname,
        phone,
        address,
        country,
        city,
        postalCode,
      });
      await CodeModel.findOneAndDelete({ code: code });
      res.status(200).json({ successMessage: "Your account has been created" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

//Users login function
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(500).json({ emailError: "Adresse E-mail incorrect" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(500).json({ passwordError: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.TOKEN_SECRET,
      { expiresIn: "3d" }
    );

    existingUser.password = undefined;

    const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 jours en millisecondes
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge,
    });

    res.status(200).json({ user: existingUser._id, person: existingUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

//Function to logout
module.exports.logout = async (req, res) => {
  try {
    // Supprime le cookie jwt
    res.cookie("jwt", "", {
      maxAge: 1,
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erreur lors de la déconnexion", error });
  }
};

// module.exports.getAllStats = async (req, res) => {
//   try {
//     const data = await UserModel.find();
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// module.exports.createNewPassword = async (req, res) => {
//   const { email, password } = req.body;
//   const userVerifiedByEmail = await UserModel.findOne({ email: email });
//   if (!userVerifiedByEmail)
//     return res.status(400).json({ message: "Utilisateur inconnu" });

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const userPasswordUpdated = await UserModel.findOneAndUpdate(
//       { email },
//       { password: hashedPassword },
//       { new: true }
//     );

//     res.status(200).json({
//       message:
//         "Mot de passe réinitialisé avec succès, vous pouvez maintenant vous connecter",
//     });
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };

module.exports.createPassword = async (req, res) => {
  const { email, password } = req.body;
  const userVerifiedByEmail = await UserModel.findOne({ email: email });
  if (!userVerifiedByEmail)
    return res.status(400).json({ message: "Utilisateur inconnu" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userPasswordUpdated = await UserModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({
      message:
        "Mot de passe réinitialisé avec succès, vous pouvez maintenant vous connecter",
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
