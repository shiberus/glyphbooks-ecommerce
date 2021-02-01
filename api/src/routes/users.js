const user = require("express").Router();
const { Product, Category, User, Order } = require("../db.js");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

user.post("/", (req, res, next) => {
  const request = req.body;

  User.create({ ...request })
    .then((u) => res.send(u))
    .catch(next);
});

user.post("/:idUser/cart", (req, res, next) => {
  var usuario;
  User.findOne({ where: { id: req.params.idUser } })
    .then((u) => {
      usuario = u;
      return u.getOrders({ where: { status: "carrito" }, include: Product });
    })
    .then((orden) => {
      if (!orden.length) {
        return Order.create({ status: "carrito" }).then((orden) => {
          usuario.addOrder(orden);
          return orden;
        });
      }
      return orden[0];
    })
    .then((orden) => {
      const quantity = req.body.quantity ? req.body.quantity : 1;
      console.log(req.body);
      return orden.addProducts(req.body.id, {
        through: { price: req.body.price, quantity: quantity },
      });
    })
    .then((r) => res.send(r))
    .catch(next);
});

user.post("/forgot", async (req, res, next) => {
  const userData = await User.findOne({
    where: { email: req.body.email },
  });

  let token = crypto.randomBytes(20);
  token = token.toString("hex");
  console.log(token);

  if (!userData) {
    return res.redirect("/forgot");
  } else {
    var smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "glyphbooksecommerce@gmail.com",
        pass: "HenryEcommerce123",
      },
    });
    var mailOptions = {
      to: userData.email,
      from: "glyphbooksecommerce@gmail.com",
      subject: "Reseteo de contraseña",
      html:
        `Entra en este link para cambiar la contraseña ` +
        `${process.env.FRONT}/password/` +
        token,
    };
    userData.resetPasswordExpires = Date.now() + 3600000;
    userData.resetPasswordToken = token;
    userData.save();

    smtpTransport.sendMail(mailOptions, function (err) {
      if (err) {
        console.log("Ocurrio un error", err);
      } else {
        req.flash(
          "passwordReset",
          "Tu contraseña ha sido reestablecida satisfactoriamente."
        );
      }
    });
  }
});

user.put("/passwordReset/:token", async (req, res, next) => {
  const userData = await User.findOne({
    where: { resetPasswordToken: req.params.token },
  });
  if (userData) {
    if (userData.resetPasswordExpires > Date.now()) {
      userData.resetPasswordExpires = Date.now();
      userData.password = req.body.password;
      await userData.save();
      var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "glyphbooksecommerce@gmail.com",
          pass: "HenryEcommerce123",
        },
      });
      var mailOptions = {
        to: userData.email,
        from: "glyphbooksecommerce@gmail.com",
        subject: "Tu contraseña ha sido cambiada correctamente",
        text:
          "Hola,\n\n" +
          "este correo es para confirmar que la contraseña de " +
          userData.email +
          " ha sido cambiada correctamente.\n",
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (err) {
          console.log("ocurrio un error", err);
        } else {
          console.log("confirmacion de cambio de contraseña enviado");
        }
      });

      return res.status(201).json({ message: "se cambio la contraseña" });
    } else {
      return res.status(204).json({ message: "Token invalido o ya expiro" });
    }
  }

  return res.status(204).json({ message: "Ocurrio un error" });
});

user.get("/:idUser/cart", (req, res, next) => {
  User.findOne({ where: { id: req.params.idUser } })
    .then((usuario) => {
      return usuario.getOrders({
        where: { status: "carrito" },
        include: Product,
      });
    })
    .then((orden) => res.send(orden))
    .catch(next);
});

user.get("/:idUser/orders", (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin || Number(req.user.id) === Number(req.params.idUser)) {
      User.findOne({ where: { id: req.params.idUser } })
        .then((usuario) => {
          return usuario.getOrders({ include: Product });
        })
        .then((orders) => res.send(orders));
    } else res.sendStatus(401);
  } else res.sendStatus(401);
});

user.put("/:id", (req, res, next) => {
  const { id } = req.params;

  const request = req.body;
  if (req.user) {
    if (req.user.isAdmin || Number(req.user.id) === Number(id)) {
      User.findOne({ where: { id } })
        .then((user) => {
          for (const key in request) {
            user[key] = request[key];
          }
          user.save();

          res.send(user);
        })
        .catch(next);
    } else res.sendStatus(401);
  } else res.sendStatus(401);
});

user.put("/:idUser/cart", (req, res, next) => {
  var sinStock = [];
  var userData;
  User.findOne({ where: { id: req.params.idUser } })
    .then((usuario) => {
      userData = usuario;
      return usuario.getOrders({
        where: { id: req.body.orderId },
        include: Product,
      });
    })
    .then(([orden]) => {
      orden.products.forEach((p) => {
        if (p.lineOrder.quantity > p.stock) {
          sinStock.push(p);
        }
      });
      if (sinStock.length) {
        return res.status(409).send(sinStock);
      }

      var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "glyphbooksecommerce@gmail.com",
          pass: "HenryEcommerce123",
        },
      });
      var mailOptions = {
        to: userData.email,
        from: "glyphbooksecommerce@gmail.com",
        subject: "Tu compra",
        text:
          "Muchas gracias por tu compra, la misma actualmente esta siendo procesada",
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        if (err) {
          console.log("Ocurrio un error", err);
        } else {
          console.log("email enviado");
          req.flash("Confirmation", "La orden ha sido procesada correctamente");
        }
      });

      orden.products.forEach((p) => {
        p.stock -= p.lineOrder.quantity;
        p.save();
      });

      orden.status = req.body.status;
      orden.save();
      res.status(200).json(orden);
    })
    .catch(next);
});

user.get("/", (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit || 12;
  const offset = page ? (page - 1) * limit : null;

  let order = req.query.order;
  if (order) {
    order = JSON.parse(order);
  }

  if (req.user) {
    if (req.user.isAdmin) {
      User.findAndCountAll({ offset, limit, order })
        .then((user) => {
          res.send(user);
        })
        .catch(next);
    } else res.sendStatus(401);
  } else res.sendStatus(401);
});

user.get("/:id", (req, res, next) => {
  User.findByPk(req.params.id)
    .then((user) => res.send(user))
    .catch(next);
});

user.get("/login", (req, res, next) => {
  User.findOne({
    where: { email: req.query.email, password: req.query.contraseña },
  })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
});

user.delete("/:id", (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin || Number(req.user.id) === Number(req.params.id)) {
      User.findOne({ where: { id: req.params.id } })
        .then((user) => user.destroy())
        .then(() => res.sendStatus(200))
        .catch(next);
    } else res.sendStatus(401);
  } else res.sendStatus(401);
});

user.delete("/:idUser/cart", (req, res, next) => {
  User.findOne({ where: { id: req.params.idUser } })
    .then((usuario) => usuario.getOrders({ where: { status: "carrito" } }))
    .then(([orden]) => orden.destroy())
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = user;
