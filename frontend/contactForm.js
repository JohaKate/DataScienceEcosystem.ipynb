const API = "http://localhost:8000";   // prefijo corregido

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;

  const body = {
    full_name: f.full_name.value.trim(),
    email    : f.email.value.trim(),
    message  : f.message.value.trim()
  };

  const res = await fetch(`${API}/contact`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify(body)
  });

  if (res.ok) {
    alert("Mensaje enviado. ¡Gracias!");
    f.reset();
  } else {
    alert("Error al enviar mensaje");
  }
});
