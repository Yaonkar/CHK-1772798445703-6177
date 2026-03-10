async function loadProfile(){

const token = localStorage.getItem("token");

try{

const response = await fetch("http://localhost:5000/api/auth/profile",{

method:"GET",

headers:{
"Authorization":"Bearer "+token
}

});

const data = await response.json();

document.getElementById("username").innerText = data.name;
document.getElementById("userrole").innerText = data.role;
document.getElementById("userbio").innerText = data.bio;
document.getElementById("joinedDate").innerText = data.createdAt;

}catch(error){

console.log("Error loading profile");

}

}

loadProfile();