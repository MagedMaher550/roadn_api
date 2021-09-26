const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const captainSchema = new Schema({
    isAvailable: {
        type: Boolean,
        required: false
    },
    dateOfRenewal: {
        type: String,
        required: true
    },
    isSubscribed: {
        type: Boolean,
        required: true
    },
    driverData: {
        personalImg: {
            type: String,
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String
        },
        idNumber: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        trips: [{
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }]
    },
    carData: {
        carBrand: {
            type: String,
            required: true
        },
        carModel: {
            type: String,
            required: true
        },
        carYear: {
            type: Number,
            required: true
        },
        carPlateNumber: {
            type: String,
            required: true
        },
        carColor: {
            type: String,
            required: true
        },
        numberOfPassengers: {
            type: Number,
            required: true
        }
    },
    driverDocuments: {
        idFrontPicture: {
            type: String,
            required: true
        },
        idBackPicture: {
            type: String,
            required: true
        },
        carFrontPicture: {
            type: String,
            required: true
        },
        carBackPicture: {
            type: String,
            required: true
        },
        driverLicenceFrontPicture: {
            type: String,
            required: true
        },
        driverLicenceBackPicture: {
            type: String,
            required: true
        },
        police: {
            type: String,
            required: true
        }
    }
});




module.exports = mongoose.model('Captain', captainSchema);