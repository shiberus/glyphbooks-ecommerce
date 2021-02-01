const server = require("express").Router();
const { Product, Category, Review, User } = require("../db.js");
const { Op } = require("sequelize");

server.get("/", (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit || 12;
  const offset = page ? (page - 1) * limit : null;
  var count;

  let where = {};

  let search = req.query.search;
  if (search) {
    where = {
      ...where,
      [Op.or]: [
        { title: { [Op.iLike]: "%" + search + "%" } },
        { description: { [Op.iLike]: "%" + search + "%" } },
        { author: { [Op.iLike]: "%" + search + "%" } },
      ],
    };
  }

  let stock = req.query.stock;
  if (stock) {
    where = {
      ...where,
      stock: { [Op.gt]: 0 },
    };
  }

  let oferta = req.query.oferta;
  if (Number(oferta) === 1) {
    where = {
      ...where,
      discount: { [Op.gt]: 0 },
    };
  } else if (Number(oferta) === 2) {
    where = {
      ...where,
      discount: 0,
    };
  }

  let order = req.query.order;
  if (order) {
    order = JSON.parse(order);
  }

  const category = req.query.category > 0 ? { id: req.query.category } : null;

  Product.count()
    .then((num) => {
      count = num;
      return Product.findAndCountAll({
        include: [{ model: Category, requiered: false, where: category }],
        limit,
        offset,
        order,
        where,
      });
    })
    .then((products) => {
      products.count = count;
      res.send(products);
    })
    .catch(next);
});

server.get("/search", (req, res, next) => {
  const { value } = req.query;

  Product.findAndCountAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: "%" + value + "%" } },
        { description: { [Op.iLike]: "%" + value + "%" } },
        { author: { [Op.iLike]: "%" + value + "%" } },
      ],
    },
  })
    .then((books) => {
      res.send(books);
    })
    .catch(next);
});

server.get("/search/:id", (req, res) => {
  Product.findOne({
    where: { id: req.params.id },
    include: { model: Review, include: User },
  })
    .then((book) => {
      if (!book) {
        res.json({ book: "No encontrado" });
      } else {
        res.json({ book: book });
      }
    })
    .catch((err) => res.json({ err }));
});

server.post("/", (req, res, next) => {
  const request = req.body;
  if (req.user) {
    if (req.user.isAdmin) {
      if (!request.img) {
        request.img =
          "https://www.pinclipart.com/picdir/big/324-3245234_closed-book-clipart-transparent-background-books-png.png";
      }
      Product.create({ ...request })
        .then((book) => {
          res.send(book);
        })
        .catch((err) => {
          res.send(err);
        });
    } else res.sendStatus(401);
  } else res.sendStatus(401);
});

server.put("/category/:idProducto/:idCategoria", (req, res) => {
  const category = req.params.idCategoria;
  if (req.user) {
    if (req.user.isAdmin) {
      Product.findOne({ where: { id: req.params.idProducto } })
        .then((producto) => {
          producto.addCategories(category);
        })
        .then((r) => res.send(r))
        .catch((err) => {
          res.json(err);
        });
    } else res.sendStatus(401);
  } else res.sendStatus(401);
});

server.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const request = req.body;

  if (req.user) {
    if (req.user.isAdmin) {
      Product.findOne({ where: { id } })
        .then((book) => {
          for (const key in request) {
            book[key] = request[key];
          }
          book.save();
          res.send(book);
        })
        .catch(next);
    } else res.sendStatus(401);
  } else res.sendStatus(401);
});

server.delete("/:idProducto/category/:idCategoria", (req, res) => {
  if (req.user) {
    if (req.user.isAdmin) {
      Product.findOne({ where: { id: req.params.idProducto } })
        .then((producto) => {
          producto
            .removeCategories(req.params.idCategoria)
            .then((r) => res.json(r));
        })
        .catch((err) => res.json(err));
    } else res.sendStatus(401);
  } else res.sendStatus(401);
});

server.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  if (req.user) {
    if (req.user.isAdmin) {
      Product.findOne({ where: { id } })
        .then((book) => {
          book.destroy();
        })
        .then(() => res.sendStatus(200))
        .catch(next);
    } else res.sendStatus(401);
  } else res.sendStatus(401);
});

module.exports = server;
