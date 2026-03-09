const form = document.getElementById("contactForm");

form.addEventListener("submit", function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const subject = document.getElementById("subject").value;
const message = document.getElementById("message").value;

console.log({
name,
email,
subject,
message
});

alert("Message sent successfully!");

form.reset();

});