const Captain = require("../models/captain");

const {
    uploadFile
} = require('../s3');

exports.postRegister = (req, res, next) => {
    const driverFullName = req.body.driverFullName;
    const driverAddress = req.body.driverAddress;
    const driverEmail = req.body.driverEmail;
    const driverPhoneNumber = req.body.driverPhoneNumber;
    const driverId = req.body.driverId;
    const driverCity = req.body.driverCity;
    const dateOfBirth = req.body.dateOfBirth;
    const carBrand = req.body.carBrand;
    const carModel = req.body.carModel;
    const carColor = req.body.carColor;
    const carYear = req.body.carYear;
    const carPlateNumber = req.body.carPlateNumber;
    const numberOfPassengers = req.body.numberOfPassengers;
    const imagesOriginalNames = req.body.imagesOriginalNames;
    const images = req.files;
    let trips = req.body.trips;
    trips = trips.filter(trip => trip.price != '0');

    const imagesIds = {};

    let dateObj = new Date(); // Today!
    dateObj.setDate(dateObj.getDate() - 1); // Yesterday!

    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();

    let dateOfRenewal = year + "/" + month + "/" + day;

    const sharp = require("sharp");
    sharp.cache(false);

    async function resizeFile(path) {
        let buffer = await sharp(path)
            .resize(500, 500, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
            })
            .toBuffer();
        return sharp(buffer).toFile(path);
    }

    let mimetypes = [];

    let promises = [];
    let promise;
    if (!images) {
        console.log("Files Missing");
    } else {
        for (let i = 0; i < images.length; i++) {
            let file = images[i];
            let fileMimetype = file['mimetype'];
            imagesIds[file['originalname']] = file['filename'];
            mimetypes[file['filename']] = fileMimetype.split('/')[1];

            resizeFile(file.path).then(async compressedFile => {
                promise = await uploadFile(
                    compressedFile,
                    fileMimetype, file['path'],
                    file['filename'] + "." + fileMimetype.split('/')[1]
                );
                promises.push(
                    promise
                );
            })
        }
    }

    const constructLink = imageName => {
        return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imagesIds[
                                    imagesOriginalNames[imageName]
                                ]}.${mimetypes[imagesIds[imagesOriginalNames[imageName]]]}`
    }

    Promise.all(promises).then(function (data) {}).then(val => {
            const personalImg = imagesIds[
                imagesOriginalNames['profilePicture']
            ];

            Captain.findOne({
                    email: driverEmail
                }).then(fetcheduser => {
                    if (fetcheduser) {
                        return res.status(422).send("This Email Is Already Exist!!");
                    } else {
                        const captain = new Captain({
                            isAvailable: true,
                            trialEnded: false,
                            dateOfRenewal: dateOfRenewal,
                            isSubscribed: false,
                            transactionHistory: [],
                            driverData: {
                                personalImg: constructLink('profilePicture'),
                                fullName: driverFullName,
                                dateOfBirth: dateOfBirth,
                                address: driverAddress,
                                phone: driverPhoneNumber,
                                email: driverEmail,
                                idNumber: driverId,
                                country: "Egypt",
                                city: driverCity,
                                trips: trips
                            },
                            carData: {
                                carBrand: carBrand,
                                carModel: carModel,
                                carYear: carYear,
                                carPlateNumber: carPlateNumber,
                                carColor: carColor,
                                numberOfPassengers: numberOfPassengers,
                            },

                            driverDocuments: {
                                idFrontPicture: constructLink('idFrontPicture'),
                                idBackPicture: constructLink('idBackPicture'),
                                carFrontPicture: constructLink('carFrontPicture'),
                                carBackPicture: constructLink('carFrontPicture'),
                                driverLicenceFrontPicture: constructLink('driverLicenceFrontPicture'),
                                driverLicenceBackPicture: constructLink('driverLicenceBackPicture'),
                                police: constructLink('police')
                            }
                        });
                        return captain.save();
                    }
                })
                .then(val => {
                    res.status(200).json({
                        message: 'Captain Registered successfully.',
                        data: {
                            driverId: driverId,
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(function (err) {
            res.send(err.stack);
        });
};

exports.getCaptainData = (req, res, next) => {

    const idNumber = req.params.id;
    Captain.findOne({
            "driverData.idNumber": idNumber
        }, {
            "driverDocuments": 0
        })
        .then(captain => {
            res.status(200).json({
                message: "Data Retrieved Successfully.",
                data: captain
            })
        }).catch(err => {
            console.log(err);
        });
}
exports.getCaptainDataWithoutImg = (req, res, next) => {

    const idNumber = req.params.id;
    Captain.findOne({
            "driverData.idNumber": idNumber
        }, {
            "driverData.personalImg": 0,
            "driverDocuments": 0,
        })
        .then(captain => {
            res.status(200).json({
                message: "Data Retrieved Successfully.",
                data: captain
            })
        }).catch(err => {
            console.log(err);
        });
}

exports.updateCaptain = (req, res, next) => {
    const driverFullName = req.body.data.driverFullName;
    const driverAddress = req.body.data.driverAddress;
    const driverEmail = req.body.data.driverEmail;
    const driverPhoneNumber = req.body.data.driverPhoneNumber;
    const driverCity = req.body.data.driverCity;
    const dateOfBirth = req.body.data.DateOfBirth;
    const id = req.body.id;

    Captain.findOneAndUpdate({
            "driverData.idNumber": id
        }, {
            'driverData.fullName': driverFullName,
            'driverData.dateOfBirth': dateOfBirth,
            'driverData.address': driverAddress,
            'driverData.email': driverEmail,
            'driverData.phone': driverPhoneNumber,
            'driverData.city': driverCity
        })
        .then(val => {
            res.status(200).json({
                message: "Captain Updated Successfully.",
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.updateCar = (req, res, next) => {

    const carBrand = req.body.data.carBrand;
    const carModel = req.body.data.carModel;
    const carColor = req.body.data.carColor;
    const carYear = req.body.data.carYear;
    const carPlateNumber = req.body.data.carPlateNumber;
    const numberOfPassengers = req.body.data.numberOfPassengers;
    const id = req.body.id;


    Captain.findOneAndUpdate({
            "driverData.idNumber": id
        }, {
            'carData.carBrand': carBrand,
            'carData.carModel': carModel,
            'carData.carColor': carColor,
            'carData.carYear': carYear,
            'carData.carPlateNumber': carPlateNumber,
            'carcarData.numberOfPassengers': numberOfPassengers
        })
        .then(val => {
            res.status(200).json({
                message: "Car Data Updated Successfully.",
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.updateTrips = (req, res, next) => {
    const id = req.body.id;

    let trips = req.body.data;
    trips = trips.filter(trip => trip.price != '0');


    Captain.findOneAndUpdate({
            "driverData.idNumber": id
        }, {
            'driverData.trips': trips
        })
        .then(val => {
            res.status(200).json({
                message: "Captain Trips Updated Successfully.",
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.changeCaptainState = (req, res, next) => {
    const idNumber = req.body.id;
    Captain.findOne({
            "driverData.idNumber": idNumber
        }, {
            "driverDocuments": 0
        })
        .then(captain => {
            Captain.findOneAndUpdate({
                    "driverData.idNumber": idNumber
                }, {
                    'isAvailable': !captain.isAvailable
                })
                .then(val => {
                    res.status(200).json({
                        message: "Captain State Updated Successfully.",
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        }).catch(err => {
            console.log(err);
        });

}

exports.postLogin = (req, res, next) => {
    const id = (req.body.id).toString();
    const phoneNumber = (req.body.phoneNumber).toString();
    Captain.findOne({
            "driverData.idNumber": id
        })
        .then(user => {
            if (!user) {
                return res.status(200).json({
                    message: "This user does not exist (هذا المستخدم غير موجود )"
                });
            }

            if (((user.driverData.phone).toString()).slice(-4) == phoneNumber.toString().slice(-4)) {
                res.status(200).json({
                    message: "user exist",
                    id: id
                });
            } else {
                res.status(200).json({
                    message: "data does not match id  (البيانات غير مطابقة )"
                });
            }
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};

exports.confirmPayment = (req, res, next) => {
    const id = req.body.id;

    let dateObj = new Date(); // Today!

    Date.isLeapYear = function (year) {
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    };

    Date.getDaysInMonth = function (year, month) {
        return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };

    Date.prototype.isLeapYear = function () {
        return Date.isLeapYear(this.getFullYear());
    };

    Date.prototype.getDaysInMonth = function () {
        return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
    };

    Date.prototype.addMonths = function (value) {
        let n = this.getDate();
        this.setDate(1);
        this.setMonth(this.getMonth() + value);
        this.setDate(Math.min(n, this.getDaysInMonth()));
        return this;
    };

    let newDateObj = dateObj.addMonths(1);

    let month = newDateObj.getUTCMonth() + 1; //months from 1-12
    let year = newDateObj.getUTCFullYear();
    let day = newDateObj.getUTCDate();


    let newDateOfRenewal = year + "/" + month + "/" + day;

    Captain.findOne({
            "driverData.idNumber": id
        }).then(captain => {
            let oldTransactionHistory = captain.transactionHistory;

            let today = new Date();
            let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let dateTime = (date + ' ' + time).toString();
            let newTransactionHistory = [...oldTransactionHistory, {
                "dateOfPayment": dateTime
            }];

            return newTransactionHistory;

        })
        .then(newTransactionHistory => {
            Captain.findOneAndUpdate({
                    "driverData.idNumber": id
                }, {
                    dateOfRenewal: newDateOfRenewal,
                    transactionHistory: newTransactionHistory,
                    trialEnded: true
                })
                .then(val => {
                    res.status(200).json({
                        message: "Subscription confirmed."
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.userIdExist = (req, res, next) => {
    const id = req.params.id;

    Captain.findOne({
            "driverData.idNumber": id
        })
        .then(captain => {
            if (captain) {
                res.status(200).json({
                    exist: true
                });
            } else {
                res.status(200).json({
                    exist: false
                });
            }
        })
}

exports.trialEnded = (req, res, next) => {
    const id = req.params.id;
    Captain.findOne({
            "driverData.idNumber": id
        })
        .then(captain => {
            if (captain) {
                res.status(200).json({
                    isTrialEnded: captain.trialEnded
                });
            }
        })
}