const mongoose = require('mongoose');

// Define the purchase schema
const purchaseSchema = new mongoose.Schema({
    name: {
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
    paymentMethod: {
        type: String,
        enum: ['cash_on_delivery'], // You can add more payment methods here if needed
        required: true
    }
});

// Create a Purchase model based on the schema
const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
