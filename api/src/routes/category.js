const category = require("express").Router();
const { Category } = require("../db.js");
const { Product } = require("../db.js");
const { Op } = require("sequelize");

category.post("/", (req, res, next) => {
  const request = req.body;

  if (req.user) {
    if (req.user.isAdmin) {
      Category.create({ ...request })
        .then(() => res.sendStatus(204))
        .catch(next);
    } else res.sendStatus(401);
  } else res.sendStatus(401);
});

category.get("/", (req, res) => {
  Category.findAll().then((categories) => {
    res.send(categories);
  });
});

category.get("/:id", (req, res) => {
  Category.findOne({ where: { id: req.params.id } })
    .then((categoria) => res.json({ category: categoria }))
    .catch((err) => res.json({ error: err }));
});

category.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  Category.findOne({ where: { id } }).then((cat) => {
    cat.destroy();
  });
});

category.put("/:id", (req, res, next) => {
  const { id } = req.params;

  Category.findOne({ where: { id } })
    .then((cat) => res.send(cat))
    .catch(next);
});

module.exports = category;
