const UserModel = require("../modals/user.model");
const ObjectId = require("mongoose").Types.ObjectId;
const commentModel = require("../modals/comment.model");
const CodeModel = require("../modals/code.models");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

//Get all users
module.exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(400).json(err);
  }
};

//Update single user
module.exports.getOneUser = async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id))
    return res.status(400).json({ message: "ID inconnu " + id });

  try {
    const userInfo = await UserModel.findById(id).select("-password");
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(400).send(error);
  }
};

//Get user info by this e-mail
module.exports.getMail = async (req, res) => {
  const { mail } = req.params;

  try {
    const userInfo = await UserModel.findOne({ email: mail }).select(
      "-password"
    );
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(400).send(error);
  }
};

//Update a specific user
module.exports.updateUser = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id))
    return res.status(400).json({ message: "ID inconnu " + id });

  const userFind = await UserModel.findById(id);
  const profi = userFind.profil;
  const lastnam = userFind.lastname;
  const firstnam = userFind.firstname;
  const phon = userFind.phone;
  const addres = userFind.address;
  const countr = userFind.country;
  const cit = userFind.city;

  try {
    const userUpdating = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          profil: req.body.profil ? req.body.profil : profi,
          lastname: req.body.lastname ? req.body.lastname : lastnam,
          firstname: req.body.firstname ? req.body.firstname : firstnam,
          phone: req.body.phone ? req.body.phone : phon,
          address: req.body.address ? req.body.address : addres,
          country: req.body.country ? req.body.country : countr,
          city: req.body.city ? req.body.city : cit,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json(userUpdating);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

//Delete a specific user
module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id))
    return res.status(400).json({ message: "ID inconnu " + id });

  try {
    const userDeleted = await UserModel.findByIdAndDelete(id);
    res.status(200).json({
      message: "User with ID: " + userDeleted._id + " is successfully deleted",
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

//Get all users stats
module.exports.getStats = async (req, res) => {
  const months_array = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  try {
    await UserModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]).exec(function (error, result) {
      if (error) {
        res.status(500).send(error);
      } else {
        let tabMonth = [];
        result
          .sort((a, b) => b._id - a._id)
          .map((item) => {
            if (item._id === 1) {
              item._id = "Janvier";
              tabMonth.push(item);
            } else if (item._id === 2) {
              item._id = "Février";
              tabMonth.push(item);
            } else if (item._id === 3) {
              item._id = "Mars";
              tabMonth.push(item);
            } else if (item._id === 4) {
              item._id = "Avril";
              tabMonth.push(item);
            } else if (item._id === 5) {
              item._id = "Mai";
              tabMonth.push(item);
            } else if (item._id === 6) {
              item._id = "Juin";
              tabMonth.push(item);
            } else if (item._id === 7) {
              item._id = "Juillet";
              tabMonth.push(item);
            } else if (item._id === 8) {
              item._id = "Août";
              tabMonth.push(item);
            } else if (item._id === 9) {
              item._id = "Septembre";
              tabMonth.push(item);
            } else if (item._id === 10) {
              item._id = "0ctobre";
              tabMonth.push(item);
            } else if (item._id === 11) {
              item._id = "Novembre";
              tabMonth.push(item);
            } else if (item._id === 12) {
              item._id = "Décembre";
              tabMonth.push(item);
            } else {
              console.log(item);
            }
          });
        res.json(tabMonth);
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.createComment = async (req, res) => {
  const {
    commentEmail,
    commentLastname,
    commentFirstname,
    comment,
    isCommentValid,
    image,
  } = req.body;

  try {
    const commentUser = await commentModel.create({
      commentEmail,
      commentLastname,
      commentFirstname,
      comment,
      isCommentValid,
      image,
    });
    res.status(200).json(commentUser);
  } catch (error) {
    res.status(400).json(error);
  }
};

// SEND USER VERIFICATION CODE

module.exports.verificationCode = async (req, res) => {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const { email } = req.body;

    const data = await resend.emails.send({
      from: "2IBN Verification <verification@2ibn.com>",
      to: email,
      subject: "Votre code de vérification - 2IBN",
      reply_to: "support@2ibn.com",
      html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Vérification 2IBN</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <table role="presentation" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- En-tête -->
                  <tr>
                      <td style="background-color: #d97706; padding: 30px; text-align: center; font-size:24px;">
                          2IBN
                      </td>
                  </tr>
  
                  <!-- Contenu principal -->
                  <tr>
                      <td style="padding: 40px 30px;">
                          <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px;">Code de vérification</h1>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                              Pour finaliser votre vérification, veuillez utiliser le code suivant :
                          </p>
                          <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; text-align: center; margin-bottom: 30px;">
                              <span style="font-size: 32px; font-weight: bold; color: #d97706; letter-spacing: 4px;">
                                  ${verificationCode}
                              </span>
                          </div>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                              Ce code expirera dans <strong>30 minutes</strong>.
                          </p>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                              Si vous n'avez pas demandé ce code, veuillez ignorer cet email.
                          </p>
                      </td>
                  </tr>
  
                  <!-- Instructions de sécurité -->
                  <tr>
                      <td style="padding: 0 30px 30px;">
                          <div style="background-color: #fff8e1; border-radius: 6px; padding: 20px;">
                              <p style="color: #996c00; font-size: 14px; line-height: 1.5; margin: 0;">
                                  <strong>🔒 Conseils de sécurité :</strong><br>
                                  Ne partagez jamais ce code avec qui que ce soit. L'équipe 2IBN ne vous demandera jamais votre code de vérification.
                              </p>
                          </div>
                      </td>
                  </tr>
  
                  <!-- Pied de page -->
                  <tr>
                      <td style="padding: 30px; background-color: #f8f9fa; text-align: center;">
                          <p style="color: #999999; font-size: 14px; margin: 0 0 10px;">
                              © 2024 2IBN. Tous droits réservés.
                          </p>
                          <p style="color: #999999; font-size: 14px; margin: 0 0 10px;">
                              Cet email a été envoyé à ${email}
                          </p>
                          <div style="margin-top: 20px;">
                              <a href="https://2ibn.com" style="color: #d97706; text-decoration: none; margin: 0 10px;">Site web</a> |
                              <a href="https://2ibn.com/echange-de-kamas" style="color: #d97706; text-decoration: none; margin: 0 10px;">Echange de kamas</a> |
                              <a href="https://2ibn.com/vendre-des-kamas" style="color: #d97706; text-decoration: none; margin: 0 10px;">Vendre vos kamas</a>
                          </div>
                      </td>
                  </tr>
              </table>
  
              <!-- Message anti-spam -->
              <table role="presentation" width="100%" style="max-width: 600px; margin: 20px auto;">
                  <tr>
                      <td style="text-align: center; color: #999999; font-size: 12px;">
                          <p>
                              Cet email a été envoyé par 2IBN. Pour vous assurer de recevoir nos emails, 
                              ajoutez verification@2ibn.com à votre liste de contacts.
                          </p>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
      `,
      text: `Votre code de vérification 2IBN est : ${verificationCode}. Ce code expirera dans 30 minutes. Si vous n'avez pas demandé ce code, veuillez ignorer cet email.`,
    });

    await CodeModel.create({ code: verificationCode });

    res.status(200).json({
      success: true,
      message: "Code de vérification envoyé avec succès",
      data: data,
      code: verificationCode,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'email",
      error: error.message,
    });
  }
};

module.exports.getAllComments = async (req, res) => {
  try {
    const allComments = await commentModel.find({ isCommentValid: true });
    res.status(200).json(allComments);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.updateComment = async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id))
    return res.status(400).json({ message: "ID inconnu " + id });

  try {
    const commentUpdated = await commentModel.findByIdAndUpdate(
      id,
      {
        $set: {
          isCommentValid: req.body.isCommentValid,
        },
      },
      { new: true }
    );
    res.status(200).json(commentUpdated);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id))
    return res.status(400).json({ message: "ID inconnu " + id });

  try {
    const commentDeleted = await commentModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Commentaire supprimé avec succés" });
  } catch (error) {
    res.status(400).json(error);
  }
};
