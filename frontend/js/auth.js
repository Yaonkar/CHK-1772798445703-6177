// Login from handdeling

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if(loginForm){

loginForm.addEventListener("submit", async function(e){

e.preventDefault();

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

try{

const response = await fetch("http://localhost:5000/api/auth/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password
})

});

const data = await response.json();

if(response.ok){

localStorage.setItem("token",data.token);

loginMessage.style.color="lightgreen";
loginMessage.innerText="Login successful";

setTimeout(()=>{

window.location.href="dashboard.html";

},1200);

}else{

loginMessage.style.color="red";
loginMessage.innerText=data.message;

}

}catch(error){

loginMessage.style.color="red";
loginMessage.innerText="Server error";

}

});

}

// Registration form handling

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", function(e){

e.preventDefault();

const name=document.getElementById("name").value;
const email=document.getElementById("email").value;
const password=document.getElementById("password").value;
const bio=document.getElementById("bio").value;

const roles=[];

document.querySelectorAll(".roles-grid input:checked").forEach(r=>{
roles.push(r.value);
});

if(roles.length===0){

registerMessage.style.color="red";
registerMessage.innerText="Select at least one role";
return;

}

console.log({
name,
email,
password,
roles,
bio
});

registerMessage.style.color="lightgreen";
registerMessage.innerText="Registration page ready";

});


// admin login from handdeling

const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginMessage = document.getElementById("adminLoginMessage");

if(adminLoginForm){

adminLoginForm.addEventListener("submit", async function(e){

e.preventDefault();

const email=document.getElementById("adminEmail").value;
const password=document.getElementById("adminPassword").value;

try{

const response = await fetch("http://localhost:5000/api/auth/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password
})

});

const data = await response.json();

if(response.ok && data.user.role === "admin"){

localStorage.setItem("token",data.token);

adminLoginMessage.style.color="lightgreen";
adminLoginMessage.innerText="Admin login successful";

setTimeout(()=>{

window.location.href="admin.html";

},1200);

}else{

adminLoginMessage.style.color="red";
adminLoginMessage.innerText="Access denied. Admin only.";

}

}catch(error){

adminLoginMessage.style.color="red";
adminLoginMessage.innerText="Server error";

}

});

}