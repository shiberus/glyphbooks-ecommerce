const order = require("express").Router();
const { Order, Product, User } = require("../db.js");
const { Op } = require("sequelize");

order.get("/", (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit || 12;
  const offset = page ? (page - 1) * limit : null;

  let where = req.query.admin;
  if (where) {
    where = { status: { [Op.not]: "carrito" } };
  }

  let order = req.query.order;
  if (order) {
    order = JSON.parse(order);
  }

  if (req.user) {
    if (req.user.isAdmin) {
      Order.findAndCountAll({ include: Product, limit, offset, order, where })
        .then((ordenes) => res.json(ordenes))
        .catch(next);
    } else res.sendStatus(401);
  } else res.sendStatus(401);
});

order.get("/:id/order", (req, res, next) => {
  Order.findOne({
    where: { id: req.params.id },
    include: [{ model: Product }, { model: User }],
  })
    .then((orden) => res.json(orden))
    .catch(next);
});

order.get("/:id", (req, res, next) => {
  //modificar 'lineOrder' por 'LineOrder', en todos los archivos
  Order.findOne({ where: { id: req.params.id } })
    .then((orden) => orden.getlineOrders())
    .then((lineO) => res.json(lineO))
    .catch(next);
});

order.put("/:id", (req, res, next) => {
  Order.findOne({ where: { id: req.params.id }, include: Product })
    .then((orden) => {
      for (var key in req.body) {
        orden[key] = req.body[key];
        if (key === "status" && req.body[key] === "cancelada") {
          orden.products.forEach((p) => {
            p.stock += p.lineOrder.quantity;
            p.save();
          });
        }
      }
      orden.save();
      res.json(orden);
    })
    .catch(next);
});

order.put("/:orderId/lineorder", (req, res, next) => {
  const { quantity, id } = req.body;
  const { orderId } = req.params;
  Order.findByPk(orderId, { include: Product })
    .then(({ products }) => {
      const { lineOrder } = products.find((p) => p.lineOrder.id === id);
      lineOrder.quantity = quantity;
      lineOrder.save();
      res.send(lineOrder);
    })
    .catch(next);
});

order.delete("/:orderId/lineorder/:productId", (req, res, next) => {
  const { orderId, productId } = req.params;
  Order.findByPk(orderId, { include: Product })
    .then(({ products }) => {
      const { lineOrder } = products.find((p) => p.id === Number(productId));
      return lineOrder.destroy();
    })
    .then((data) => res.send(data))
    .catch(next);
});

module.exports = order;
