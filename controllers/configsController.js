const db = require("../models");

// Defining methods for the booksController
module.exports = {
  find: function(req, res) {
    // console.log(req.body)
    const filter = {
      env: req.body.env,
      subCategory: req.body.subCategory,
      serverType: req.body.serverType,
      hostName: { $in: req.body.hostName},
      time: {
        $gte: req.body.fromTime,
        $lt: req.body.toTime
      }
    }
    switch(req.body.type){
      case "MULTIPLE_SERVERS":{

        console.log(filter)
        db.Config
        .find(filter)
        .then(dbModel => res.json(dbModel))
        .catch(err => {
          console.log(err)
          res.status(422).json(err)
        });
        break;
      }
      case "TWO_SERVERS":{

        console.log(filter)
        db.Config
        .find(filter)
        .then(dbModel => res.json(dbModel))
        .catch(err => {
          console.log(err)
          res.status(422).json(err)
        });
        break;
      }
      case "COMPARE_BY_TIME":{
        const time = {
          $gte: req.body.fromTime,
          $lt: req.body.toTime 
        }
        filter.time = time;
        console.log(filter)
        db.Config
        .find(filter)
        .then(dbModel => res.json(dbModel))
        .catch(err => {
          console.log(err)
          res.status(422).json(err)
        });
        break;
      }
      
    }

  },
};
