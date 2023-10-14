const ValidationRule = require("./validationRules");

exports.formValidation = (name) => (req, res, next) => {
    var validatioFlag = true;
    var validationError = [];
    var data = req.body;
    ValidationRule.forEach(element => {
        if(element.required) {
            if(!data[element.name] || data[element.name] == "" || data[element.name] == null) {
                validationError.push(element.name+ "required"); 
                validatioFlag = false;
            }
        }
    });
    if(validatioFlag) {
        next();
    } else {
        res.status(200).json({
            status: "success",
            error: {
                status: true,
                code: 400,  
                message: validationError
            },
            message: "Bad request",
            result: null
        });
    }
};

