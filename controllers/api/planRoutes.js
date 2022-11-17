const express = require("express");
const router = express.Router();
const db = require("../../models");

// GET geral de planos
router.get("/", async (req, res) => {
  try {
    const plans = await db.Plan.findAll({
      attributes: {exclude: ['createdAt', 'updatedAt']}
    })
    res.status(200).json(plans)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET todos os planos por viagem
router.get('/trips/:tripId', async (req, res) => {
  try {
    const plans = await db.Plan.findAll({
      where: {
        TripId: req.params.tripId,
      },
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [
        {
          model: db.Comment,
          attributes: {exclude: ['updatedAt']},
          include: [
            {
              model: db.User,
              attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'email'] }
            }
          ]
        },
        {
          model: db.User,
          attributes: {exclude: ['createdAt', 'updatedAt', 'password', 'email']}
        },
        {
          model: db.User,
          as: 'SavedUser',
          attributes: {exclude: ['createdAt', 'updatedAt', 'password', 'email']}
        }
      ]
    });

    if (!plans) {
      res.status(404).json({message: 'nenhum plano associado a esta viagem'});
    }
    res.status(200).json(plans);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

// GET plano por ID
router.get("/:id", async (req, res) => {
  try {
    const plan = await db.Plan.findOne({
      where: { id: req.params.id},
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [
        {
          model: db.Comment,
          attributes: {exclude: ['createdAt', 'updatedAt']}
        },
        {
          model: db.User,
          attributes: {exclude: ['createdAt', 'updatedAt', 'password', 'email']}
        },
        {
          model: db.User,
          as:'SavedUser',
          attributes: {exclude: ['createdAt', 'updatedAt', 'password', 'email']}
        }
      ]
    });
    if(!plan){
      res.status(404).json({ message: 'nenhum plano associado a esta viagem' });
    }
    res.status(200).json(plan);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// CREATE 
router.post("/", async (req, res) => {
  try{
    const newPlan = await db.Plan.create(req.body);
    res.status(200).json(newPlan);
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
});

// UPDATE 
router.put("/:id", async (req,res)=>{
  try{
      db.Plan.update({
        name: req.body.name,
        budget: req.body.budget,
        content: req.body.content,
        date: req.body.date
      },
      {where:{id:req.params.id}})
      res.status(200).json({message: 'plano atualizado'})
    
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})

// POST adicionar usuário ao plano
router.post('/savedplans', async (req, res) => {
  try {
      const saveUser = await db.User.findByPk(req.body.UserId);
      await saveUser.addSavedPlan(req.body.PlanId);
      res.status(200).json({message:'plano criado'})
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

// DELETE usuário do plano
router.delete('/savedplans', async (req, res) => {
  try {
    console.log(req.body)
      const saveUser = await db.User.findByPk(req.body.UserId);
      await saveUser.removeSavedPlan(req.body.PlanId);
      res.status(200).json({message:'plano deletado'})
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

// DELETE 
router.delete("/:id", async (req, res) => {
  try {
    const delPlan = await db.Plan.destroy({
      where: { id: req.params.id }
    });
    if(!delPlan){
      res.status(404).json({ message: 'nenhum plano associado a esta viagem'});
    }
    res.status(200).json({ message: 'plano deletado'})
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;