const express = require("express");
const router = express.Router();
const db = require("../../models");

// GET de todos os itens orçados 

router.get("/", async (req, res) => {
  try {
    const items = await db.BudgetItem.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.status(200).json(items);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET de um único gasto por id

router.get("/:id", async (req, res) => {
  try {
    const item = await db.BudgetItem.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!item) {
      res.status(404).json({ message: 'nenhum item encontrado com este id' });
    }
    res.status(200).json(item);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// CREATE de novo gasto
router.post("/", async (req, res) => {
  try {
    const newItem = await db.BudgetItem.create(req.body);
    res.status(200).json(newItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// update de gasto
router.put("/:id",  async (req, res) => {
  try {
    await db.BudgetItem.update(
      {
        price: req.body.price,
        description: req.body.description
      },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ message: 'item atualizado' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE gasto por id
router.delete("/:id", async (req, res) => {
  try {
    const delItem = await db.BudgetItem.destroy({
      where: { id: req.params.id },
    });
    console.log(delItem);
    if (!delItem) {
      res.status(404).json({ message: 'nenhum item encontrado com este id' });
    }
    res.status(200).json({ message: "item excluído" });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
