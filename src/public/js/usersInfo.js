
console.log("usersInfo.js");


const removeUser = async(userId)=>{
    console.log(userId);
    fetch(`http://localhost:8080/api/users/${userId}`, {method: 'DELETE'});
};


const modifyUserRole = async(userId)=>{
    console.log(userId);
    fetch(`http://localhost:8080/api/users/premium/${userId}`, {method: 'PUT'});
};

