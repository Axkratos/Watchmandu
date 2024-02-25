const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://uranwmarshal:Uranw9825377629@cluster0.cpr8ysx.mongodb.net/userRegitration", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Connection Successful`);
}).catch((error) => {
    console.error('Connection Error:', error);
});
