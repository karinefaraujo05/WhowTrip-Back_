const express = require("express");
const router = express.Router();
const db = require("../../models");

// GET todos os comentários

router.get("/", async (req, res) => {
  try {
    const comments = await db.Comment.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET todos os comentários com o mesmo TripId

router.get("/trips/:tripId", async (req, res) => {
  try {
    const comments = await db.Comment.findAll({
      attributes: { exclude: ['updatedAt'] },
      where: {
        TripId: req.params.tripId,
      },
      include: [
        {
          model: db.User,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'email'],
          },
        },
        {
          model: db.Comment,
          as: 'SubComment',
          attributes: {
            exclude: ['updatedAt'],
          },
          include: [
            {
              model: db.User,
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'email'],
              },
            },
          ],
        },
      ],
    });
    res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET comentário por id

router.get("/:id", async (req, res) => {
  try {
    const comment = await db.Comment.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['updatedAt'] },
      include: [
        {
          model: db.User,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'email'],
          },
        },
        {
          model: db.Comment,
          as: 'SubComment',
          attributes: {
            exclude: ['updatedAt'],
          },
          include: [
            {
              model: db.User,
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'email'],
              },
            },
          ],
        },
      ],
    });
    if (!comment) {
      res.status(404).json({ message: 'no comment found with this id' });
    }
    res.status(200).json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// CREATE novo comentário

router.post("/", async (req, res) => {
  try {
    const newComment = await db.Comment.create(req.body);
    res.status(200).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// UPDATE comentário

router.put("/:id", async (req, res) => {
  try {
    db.Comment.update(
      {
        content: req.body.content,
      },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ message: 'atualização de comentário concluída' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete comentário específico
router.delete("/:id", async (req, res) => {
  try {
    const delComment = await db.Comment.destroy({
      where: { id: req.params.id },
    });
    console.log(delComment);
    if (!delComment) {
      res.status(404).json({ message: 'nenhum comentário encontrado com esse id' });
    }
    res.status(200).json({ message: "comentário excluído" });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
