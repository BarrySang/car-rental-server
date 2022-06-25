// dependancies
const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { isAuth, isAdmin } = require('./authMiddleware');

// add veihicle
router.post('/add', isAuth, isAdmin, (req, res) => {
    const {make, model, colour, manufacture_year, plate} = req.body;

    // ensure all fields are filled
    if(!make || !model || !colour || !manufacture_year || !plate) {
        res.status(400).json({msg: 'missing fields'});
    } else {
        // check for duplicate plate entries
        Vehicle.findOne({where: { plate: plate }})
        .then(vehicle => {
            if(vehicle) {
                res.status(409).json({msg: 'vehicle with similar plate number already exists'});
            } else {

            // if no errors present, add vehicle
            Vehicle.create({
                make,
                model,
                colour,
                manufacture_year,
                plate,
            })
            .then(vehicle => {
                res.status(200).send(vehicle);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({msg: 'internal server error'});
            })
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({msg: 'internal server error'});
        });
    }
});

// get all vehicles
router.get('/', isAuth, isAdmin, (req, res, next) => {
    Vehicle.findAll()
    .then(vehicles => {
        if(vehicles.length < 1) {
            res.status(200).json({msg: 'no vehicles found'});
        } else {
            res.status(200).json(vehicles);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({msg: 'internal server error'});
    });
});

// get one vehicle
router.get('/:id', isAuth, (req, res, next) => {
    // get id from request
    let id = req.params.id;

    Vehicle.findByPk(id)
    .then(vehicle => {
        console.log(vehicle);
        if(vehicle) {
            // check if user is admin
            if(!req.user.admin) {
                // if user is not admin, ensure vehicle is available before sending it
                if(!vehicle.availability) {
                    res.status(403).json({msg: 'requested resource forbidden'});
                } else {
                    res.status(200).json(vehicle);
                }
            } else {
                // if user is admin, just send the vehicle
                res.status(200).json(vehicle);
            }
        } else {
            // if user is not admin, send 403
            if(!req.user.admin) {
                res.status(403).json({msg: 'requested resource forbidden'});
            } else {
                // if user is admin, send actual error message
                res.status(404).json({msg: 'vehicle not found'});
            }
        }
        
    })
    .catch(err => {
        res.status(500).json({msg: 'internal server error'});
    });
});

// get all available vehicles
router.get('/get/available', isAuth, (req, res, next) => {
    Vehicle.findAll({where: {availability: '0'}})
    .then(vehicles => {
        if(vehicles.length < 1) {
            res.status(200).json({msg: 'no available vehicles'});
        } else {
            res.status(200).json(vehicles);
        }
    })
    .catch(err => {
        res.status(500).json({msg: 'internal server error'});
        console.log(err);
    })
});

// uppdate a vehicle
router.put('/:id', isAuth, isAdmin, (req, res, next) => {
    let id = req.params.id;
    console.log((Object.keys(req.body).length) < 1);
    if(Object.keys(req.body).length < 1) {
         res.status(400).json({msg: 'no fields given to update'});
    } else {
        Vehicle.findByPk(id)
        .then(vehicle => {
            if(!vehicle) {
                res.status(404).json({msg: 'vehicle not found'});
            } else {
                /*
                * store variables
                */

                if(req.body.colour && req.body.colour !== vehicle.dataValues.colour ) {
                    vehicle.colour = req.body.colour;
                }

                if(req.body.availability) {
                    console.log('hey');
                }
                if(req.body.availability && req.body.availability !== vehicle.availability) {
                    vehicle.availability = req.body.availability;
                }
                
                vehicle.save()
                .then(vehicle => {
                    res.status(200).json(vehicle);
                })
                .catch(err => {
                    res.status(500).json({msg: 'internal server error'});
                    console.log(err);
                });
            }
        })
        .catch(err => {
            res.status(200).json({msg: 'internal server error'});
            console.log(err);
        });
    }
});

module.exports = router;