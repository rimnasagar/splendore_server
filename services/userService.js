const { ROLE } = require("../constants");
const User = require("../models/User");

exports.menstionList = async (text) => {
    const list = text.split(" ");
    const menstionusers = [];
    list.forEach(element => {
        if(element.startsWith("@")) {
            menstionusers.push(element.replace("@"));
        }
    });
    console.log(menstionusers);
    const usersList = await User.find({display_name: { $in:  menstionusers}});
    if(usersList) {
        return usersList.map(x => x._id);
    }
    return [];
}

exports.isAdmin = async (userId) => {
    try {
        const user = await User.findById(userId, "role");
        return user.role === ROLE.ADMIN;
    } catch(err) {
        console.log(err);
        return false;
    }
}