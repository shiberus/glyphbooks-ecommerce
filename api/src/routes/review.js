const review = require("express").Router(),
  { Review, Product } = require("../db.js");
const { Op } = require("sequelize");

review.post("/products/:id/review", async (req, res, next) => {
  const request = req.body;
  try {
    const review = await Review.create({ ...request });
    const product = await Product.findByPk(req.params.id);
    await review.setProduct(product);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

review.get("/:productId", (req, res, next) => {
  const { productId } = req.params;
  Review.findAll({ where: { productId } }).then((reviews) => {
    res.send(reviews);
  });
});

review.get("/:productId/:userId", (req, res, next) => {
  const { productId, userId } = req.params;
  Review.findOne({ where: { productId, userId }, order: [['createdAt','DESC']] }).then((reviews) => {
    res.send(reviews);
  });
});

review.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const request = req.body;

  Review.findOne({ where: { id } })
    .then((review) => {
      for (const key in request) {
        review[key] = request[key];
      }
      review.save();
      res.send(review);
    })
    .catch(next);
});

review.delete("/products/:id/review/:idReview", (req, res, next) => {
  console.log(req.params);
  Review.findOne({ where: { id: req.params.idReview } })
    .then((review) => {
      review.destroy();
    })
    .then(() => res.sendStatus(200))
    .catch(next);
});

review.get("/", (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit || 12;
  const offset = page ? (page - 1) * limit : null;

  let order = req.query.order;
  if (order) {
    order = JSON.parse(order);
  }

  Review.findAndCountAll({ limit, offset, order })
    .then((review) => {
      res.send(review);
    })
    .catch(next);
});

review.get("/search", (req, res, next) => {
  const { value } = req.query;

  Review.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.substring]: value } },
        { body: { [Op.substring]: value } },
        { rating: { [Op.substring]: value } },
      ],
    },
  })
    .then((reviews) => {
      res.send(reviews);
    })
    .catch(next);
});

review.get("/search/:id", (req, res) => {
  Review.findOne({ where: { id: req.params.id } })
    .then((review) => {
      if (!review) {
        res.json({ review: "No encontrado" });
      } else {
        res.json({ review: review });
      }
    })
    .catch((err) => res.json({ err }));
});

module.exports = review;
