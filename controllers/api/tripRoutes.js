const express = require("express");
const sequelize = require("../../config/connection");
const router = express.Router();
const db = require("../../models");

// GET todas as viagens

router.get("/", async (req, res) => {
  try {
    const trips = await db.Trip.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.status(200).json(trips);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET viagem única e seus requisitos

router.get("/:id", async (req, res) => {
  try {
    const trip = await db.Trip.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: db.User,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'email'],
          },
        },
        {
          model: db.Comment,
          attributes: {
            exclude: ['updatedAt', 'TripId', 'PlanId', 'UserId', 'CommentId'],
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
                exclude: [
                  'updatedAt',
                  'TripId',
                  'PlanId',
                  'UserId',
                  'CommentId',
                ],
              },
              include: {
                model: db.User,
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'password', 'email'],
                },
              },
            },
          ],
        },
        {
          model: db.Plan,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'TripId', 'UserId'],
          },
          include: {
            model: db.Comment,
            attributes: {
              exclude: ['updatedAt', 'TripId', 'PlanId', 'UserId', 'CommentId'],
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
                attributes: {
                  exclude: [
                    'updatedAt',
                    'TripId',
                    'PlanId',
                    'UserId',
                    'CommentId',
                  ],
                },
                include: {
                  model: db.User,
                  attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', 'email'],
                  },
                },
              },
            ],
          },
        },
        {
          model: db.User,
          as: 'SavedUser',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'password',
              'email',
              'UserTrip',
            ],
          },
        },
        {
          model: db.Budget,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.User,
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'email'],
              },
            },
            {
              model: db.BudgetCategory,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              include: {
                model: db.BudgetItem,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
            },
          ],
        },
        {
          model: db.Plan,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: [
            {
              model: db.Comment,
              attributes: { exclude: ['updatedAt'] },
              include: [{
                model: db.User,
                attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'email'] },
              }]
            },
            {
              model: db.User,
              attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'email'] },
            },
            {
              model: db.User,
              as: 'SavedUser',
              attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'email'] },
            }
          ]
        }
      ],
    });
    if (!trip) {
      res.status(404).json({ message: 'nenhuma viagem encontrada com este id' });
    }
    res.status(200).json(trip);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// CREATE nova viagem
router.post("/", async (req, res) => {
  try {
    const newTrip = await db.Trip.create(req.body);
    res.status(200).json(newTrip);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// UPDATE 
router.put("/:id", async (req, res) => {
  try {
    db.Trip.update(
      {
        name: req.body.name,
        destination: req.body.destination,
        departure: req.body.departure,
        return: req.body.return,
      },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ message: 'trip atualizada' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// POST adicionar usuário a viagem
router.post('/savedtrips', async (req, res) => {
  try {
      const saveUser = await db.User.findByPk(req.body.UserId);
      await saveUser.addSavedTrip(req.body.TripId);
      res.status(200).json({message:'Adicionado'})
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

// DELETE - remover usuário da viagem

router.delete('/savedtrips', async (req, res) => {
  try {
      const saveUser = await db.User.findByPk(req.body.UserId);
      await saveUser.removeSavedTrip(req.body.TripId);
      res.status(200).json({message:'Removido'})
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

// DELETE 
router.delete("/:id", async (req, res) => {
  try {
    const delTrip = await db.Trip.destroy({
      where: { id: req.params.id },
    });
    console.log(delTrip);
    if (!delTrip) {
      res.status(404).json({ message: 'nenhuma viagem encontrada com este id' });
    }
    res.status(200).json({ message: "trip excluída" });
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
