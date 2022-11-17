const express = require("express");
const router = express.Router();
const db = require("../../models");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// GET usuários
router.get("/", async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET usuário por id
router.get("/:id", async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: db.Trip,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include:{
            model: db.User,
            attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'email'] },
            as: 'SavedUser'
          }
        },
        {
          model: db.Comment,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.Plan,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.Plan,
          as: 'SavedPlan',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          through: { attributes: { exclude: ['createdAt', 'updatedAt'] } },
        },
        {
          model: db.Trip,
          as: 'SavedTrip',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: {
            model: db.User,
            as: 'SavedUser',
            attributes: { exclude:['createdAt', 'updatedAt'] }
          },
          through: { attributes: { exclude: ['createdAt', 'updatedAt'] } },
        },
        {
          model: db.Budget,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include:{
            model: db.BudgetCategory,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include:{
              model: db.BudgetItem,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            }
          }
        }
      ],
    });
    if (!user) {
      res.status(404).json({ message: 'nenhum user encontrado com este id' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// update a user
router.put("/:id", async (req,res)=>{
  try{
      db.User.update({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
      },
      {where:{id:req.params.id}})
      res.status(200).json({message: 'usuário atualizado'})
    
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})

// CREATE novo usuário
router.post("/", async (req, res) => {
  try {
    const user = await db.User.create(req.body);
    process.env.JWT_SECRET,
    {
      expiresIn:'2h'
    };
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// POST login do usuário
router.post("/login", (req, res) => {
    db.User.findOne({
      where: {
        username: req.body.username,
      },
    }).then((user) => {
      if (!user) {
        res.status(403).json({
          message: "incorrect username or password",
        });
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (isPasswordCorrect) {
          res.status(200).json(user); 
        } else {
          res.status(403).json({
            message: "incorrect username or password",
          });
        }
      }
    });
  });

// DELETE usuário com id
router.delete("/:id", async (req, res) => {
  try {
    const delUser = await db.User.destroy({
      where: { id: req.params.id },
    });
    console.log(delUser);
    if (!delUser) {
      res.status(404).json({ message: 'nenhum user encontrado com este id' });
    }
    res.status(200).json({ message: "usuário excluído" });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
