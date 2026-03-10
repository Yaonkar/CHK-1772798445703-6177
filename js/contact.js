const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Message sent successfully");
        contactForm.reset();
      } else {
        alert(data.message || "Failed to send message");
      }

    } catch (error) {
      alert("Backend contact API not found or server not running");
      console.log(error);
    }
  });
}