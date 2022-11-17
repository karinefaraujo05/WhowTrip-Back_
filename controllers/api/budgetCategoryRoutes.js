const express = require("express");
const router = express.Router();
const db = require("../../models");

// GET de todos os gastos por categoria
router.get("/", async (req, res) => {
  try {
    const categories = await db.BudgetCategory.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET de categoria por id
router.get("/:id", async (req, res) => {
  try {
    const category = await db.BudgetCategory.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: db.BudgetItem,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    });
    if (!category) {
      res.status(404).json({ message: 'nenhuma categoria encontrada com este Id' });
    }
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// CREATE de novo gasto
router.post("/", async (req, res) => {
  try {
    const newBudget = await db.BudgetCategory.create(req.body);
    res.status(200).json(newBudget);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// UPDATE de categoria
router.put("/:id", async (req, res) => {
  try {
    await db.BudgetCategory.update(
      {
        description: req.body.description,
      },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ message: 'categoria atualizada' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE a categoria por id
router.delete("/:id", async (req, res) => {
  try {
    const delCategory = await db.BudgetCategory.destroy({
      where: { id: req.params.id },
    });
    console.log(delCategory);
    if (!delCategory) {
      res.status(404).json({ message: 'nenhuma categoria encontrada com este Id' });
    }
    res.status(200).json({ message: "categoria excluída" });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
