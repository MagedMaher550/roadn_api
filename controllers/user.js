const Captain = require("../models/captain");

exports.getTrips = (req, res, next) => {

    const from = req.param('from');
    const to = req.param('to');
    const nextData = parseInt(req.param('next'));

    Captain.aggregate([{
            $match: {
                "driverData.trips": {
                    $elemMatch: {
                        $and: [{
                            'from': from
                            // {
                            //     $regex: new RegExp(from)
                            // }
                        }, {
                            'to': to
                            // {
                            //     $regex: new RegExp(to)
                            // },
                        }]
                    }
                }
            }
        },
        {
            $match: {
                "isSubscribed": true
            }
        },
        {
            $project: {
                "_id": 1,
                "driverData.fullName": 1,
                "driverData.phone": 1,
                "driverData.personalImg": 1,
                "carData": 1,
                "driverData.trips": 1,
            }
        },
        {
            $skip: nextData
        },
        {
            $limit: 10
        }

    ]).allowDiskUse(true).exec((err, results) => {
        res.status(200).json({
            trips: results,
        });
    });

}

exports.getTripsSorted = (req, res, next) => {

    // const isEqualOrIsSub = (search, text) => {
    //     let resText = "not found!!";

    //     if (search.length == text.length) {
    //         if (search == text) {
    //             resText = search;
    //         }
    //     } else {
    //         if (text.includes(search)) {
    //             resText = search;
    //         }
    //     }


    //     // console.log("search: ", search);
    //     // console.log("text: ", text);
    //     // console.log("result: ", resText);
    //     // console.log("");
    //     // console.log("");

    //     return resText;
    // }

    const from = req.param('from');
    const to = req.param('to');
    const nextData = parseInt(req.param('next'));
    const sortBy = req.param('sort');




    if (sortBy == "Price (Lowest)" || sortBy == "السعر (الأقل)") {

        Captain.aggregate([{
                $match: {
                    "driverData.trips": {
                        $elemMatch: {
                            $and: [{
                                'from': from
                                // {
                                //     $regex: new RegExp(from)
                                // }
                            }, {
                                'to': to
                                // {
                                //     $regex: new RegExp(to)
                                // }
                            }]
                        }
                    }
                }
            },
            {
                $match: {
                    "isSubscribed": true
                }
            },
            {
                $project: {
                    "_id": 1,
                    "driverData.fullName": 1,
                    "driverData.phone": 1,
                    "carData": 1,
                    "driverData.trips": 1,
                    "driverData.personalImg": 1,
                    adjustedTrips: {
                        $filter: {
                            input: "$driverData.trips",
                            as: "trip",
                            cond: {
                                $and: [
                                    {
                                        $eq: ["$$trip.from", from]
                                    },

                                    {
                                        $eq: ["$$trip.to", to]
                                    },
                                ]
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    "adjustedTrips.0.price": 1
                }
            },
            {
                $skip: nextData
            },
            {
                $limit: 10
            },

        ], ).allowDiskUse(true).exec((err, results) => {
            res.status(200).json({
                trips: results,
            });
        })

    } else if (sortBy == "Price (Highest)" || sortBy == "السعر (الأعلى)") {
        Captain.aggregate([{
                $match: {
                    "driverData.trips": {
                        $elemMatch: {
                            $and: [{
                                'from': from
                                // {
                                //     $regex: new RegExp(from)
                                // }
                            }, {
                                'to': to
                                // {
                                //     $regex: new RegExp(to)
                                // }
                            }]
                        }
                    }
                }
            },
            {
                $match: {
                    "isSubscribed": true
                }
            },
            {
                $project: {
                    "_id": 1,
                    "driverData.fullName": 1,
                    "driverData.phone": 1,
                    "carData": 1,
                    "driverData.trips": 1,
                    "driverData.personalImg": 1,
                    adjustedTrips: {
                        $filter: {
                            input: "$driverData.trips",
                            as: "trip",
                            cond: {
                                $and: [{
                                        $eq: ["$$trip.from", from]
                                    },
                                    {
                                        $eq: ["$$trip.to", to]
                                    },
                                ]
                            }
                        }
                    }
                }
            },

            {
                $sort: {
                    "adjustedTrips.0.price": -1
                }
            },
            {
                $skip: nextData
            },
            {
                $limit: 10
            },

        ], ).allowDiskUse(true).exec((err, results) => {
            res.status(200).json({
                trips: results,
            });
        })
    } else if (sortBy == "Car (Oldest)" || sortBy == "السيارة (الأقدم)") {
        Captain.aggregate([{
                $match: {
                    "driverData.trips": {
                        $elemMatch: {
                            $and: [{
                                'from': from
                                // {
                                //     $regex: new RegExp(from)
                                // }
                            }, {
                                'to': to
                                // {
                                //     $regex: new RegExp(to)
                                // }
                            }]
                        }
                    }
                }
            }, {
                $match: {
                    "isSubscribed": true
                }
            },
            {
                $project: {
                    "_id": 1,
                    "driverData.fullName": 1,
                    "driverData.phone": 1,
                    "carData": 1,
                    "driverData.trips": 1,
                    "driverData.personalImg": 1,
                }
            },
            {
                $sort: {
                    "carData.carYear": 1
                }
            },
            {
                $skip: nextData
            },
            {
                $limit: 10
            },

        ], ).allowDiskUse(true).exec((err, results) => {
            res.status(200).json({
                trips: results,
            });
        })
    } else if (sortBy == "Car (Newest)" || sortBy == "السيارة (الأحدث)") {
        Captain.aggregate([{
                $match: {
                    "driverData.trips": {
                        $elemMatch: {
                            $and: [{
                                'from': from
                                // {
                                //     $regex: new RegExp(from)
                                // }
                            }, {
                                'to': to
                                // {
                                //     $regex: new RegExp(to)
                                // }
                            }]
                        }
                    }
                }
            }, {
                $match: {
                    "isSubscribed": true
                }
            },
            {
                $project: {
                    "_id": 1,
                    "driverData.fullName": 1,
                    "driverData.phone": 1,
                    "carData": 1,
                    "driverData.trips": 1,
                    "driverData.personalImg": 1,
                }
            },
            {
                $sort: {
                    "carData.carYear": -1
                }
            },
            {
                $skip: nextData
            },
            {
                $limit: 10
            },

        ], ).allowDiskUse(true).exec((err, results) => {
            res.status(200).json({
                trips: results,
            });
        })
    }
}


exports.captainDetails = (req, res, next) => {
    const id = req.param('id');
    //613073973f485b235c8320ed
    Captain.findById(id, {
            driverDocuments: 0,
        })
        .then(captain => {
            res.status(200).json({
                message: "Data Retrieved Successfully.",
                data: captain
            })
        })
        .catch(err => {
            console.log(err);
        })
}