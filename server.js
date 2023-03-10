const express = require('express');
const sequelize = require("./config/connection");
const compression = require('compression');
const cors = require('cors');
const timeout = require('connect-timeout')

// Sets up the Express App
const app = express();
app.use(timeout('20s'))
app.use(compression())
app.use(haltOnTimedout)
const PORT = process.env.PORT || 3000;
const allRoutes = require('./controllers');


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(haltOnTimedout)

// cors
 app.use(cors())

app.use('/',allRoutes);

function haltOnTimedout (req,res,next){
    if(!req.timedout) next()
}

sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});
