
console.log("usersInfo.js");


const removeUser = async(userId)=>{
    console.log(userId);
    fetch(`https://proyecto-final-backend-alejandro-linares-3gfg.onrender.com/api/users/${userId}`, {method: 'DELETE'});
};


const modifyUserRole = async(userId)=>{
    console.log(userId);
    fetch(`https://proyecto-final-backend-alejandro-linares-3gfg.onrender.com/api/users/premium/${userId}`, {method: 'PUT'});
};

