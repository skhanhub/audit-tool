const db = require("../models");

// Defining methods for the booksController
module.exports = {
  find: function(req, res) {
    // console.log(req.body)

    switch(req.body.type){
      case "MULTIPLE_SERVERS":{
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
        let filter = {
          env: req.body.selectedA.env,
          subCategory: req.body.selectedA.subCategory,
          serverType: req.body.selectedA.serverType,
          hostName: { $in: req.body.selectedA.hostName},
          time: {
            $gte: req.body.selectedA.fromTime,
            $lt: req.body.selectedA.toTime
          }
        }
        const response = []
        console.log(filter)
        db.Config
        .findOne(filter)
        .then(dbModel => {
          response.push(dbModel)
          filter = {
            env: req.body.selectedB.env,
            subCategory: req.body.selectedB.subCategory,
            serverType: req.body.selectedB.serverType,
            hostName: { $in: req.body.selectedB.hostName},
            time: {
              $gte: req.body.selectedB.fromTime,
              $lt: req.body.selectedB.toTime
            }
          }
          db.Config.findOne(filter)
          .then(dbModel =>{
            response.push(dbModel)
            res.json(response)
          })
        })
        .catch(err => {
          console.log(err)
          res.status(422).json(err)
        });
        break;
      }
      case "COMPARE_BY_TIME":{
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
        if(req.body.timeline){
          console.log(filter)
          db.Config
          .find(filter)
          .then(dbModel => res.json(dbModel))
          .catch(err => {
            console.log(err)
            res.status(422).json(err)
          });
        }
        else{
          const response = []
          let time = {
            $gte: req.body.fromTimeA,
            $lt: req.body.toTimeA 
          }
          filter.time = time;
          console.log(filter)
          db.Config
          .findOne(filter)
          .then(dbModel => {
            response.push(dbModel)
            time = {
              $gte: req.body.fromTimeB,
              $lt: req.body.toTimeB 
            }
            filter.time = time;
            db.Config.findOne(filter)
            .then(dbModel =>{
              response.push(dbModel)
              res.json(response)
            })
          })
          .catch(err => {
            console.log(err)
            res.status(422).json(err)
          });
        }

        

        break;
      }
      
    }

  },
};
