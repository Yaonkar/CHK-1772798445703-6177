const acceptButtons = document.querySelectorAll(".accept-btn");
const rejectButtons = document.querySelectorAll(".reject-btn");

acceptButtons.forEach(button => {
button.addEventListener("click", function(){
alert("Request Accepted");
});
});

rejectButtons.forEach(button => {
button.addEventListener("click", function(){
alert("Request Rejected");
});
});