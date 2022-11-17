const express = require("express");
const router = express.Router();
const db = require("../../models");

// GET gastos por viagem
router.get("/trips/:tripId/:userId", async (req, res) => {
  try {
    const budget = await db.Budget.findAll({
      where: {
        TripId: req.params.tripId,
        UserId: req.params.userId
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: db.BudgetCategory,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: db.BudgetItem,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        }
      }
    });
    if (!budget) {
      res.status(404).json({ message: 'nenhum gasto encontrado com este Id' });
    };
    res.status(200).json(budget)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

// GET todos os gastos
router.get("/", async (req, res) => {
  try {
    const budgets = await db.Budget.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.status(200).json(budgets);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET gasto por nome de categoria
router.get("/:id", async (req, res) => {
  try {
    const budget = await db.Budget.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: db.BudgetCategory,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include:{
          model: db.BudgetItem,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        }
      }
    });
    if (!budget) {
      res.status(404).json({ message: 'nenhum gasto encontrado com este Id' });
    }
    res.status(200).json(budget);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// CREATE novo gasto
router.post("/", async (req, res) => {
  try{
    const newBudget = await db.Budget.create(req.body);
    res.status(200).json(newBudget);
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
});

// UPDATE um gasto por id
router.put("/:id", async (req, res) => {
  try {
    db.Budget.update(
      {
        total: req.body.total,
      },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ message: 'gasto atualizado' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE a budget by id
router.delete("/:id", async (req, res) => {
  try {
    const delBudget = await db.Budget.destroy({
      where: { id: req.params.id },
    });
    console.log(delBudget);
    if (!delBudget) {
      res.status(404).json({ message: 'nenhum gasto encontrado com este TripId' });
    }
    res.status(200).json({ message: "gasto excluído" });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;