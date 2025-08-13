// Seleccionar habitación y enviar reserva
document.addEventListener("click", (e) => {
  const card = e.target.closest(".room-card");
  if (!card) return;

  document.getElementById("roomIdField").value = card.dataset.roomid;
  const section = document.getElementById("personalSection");
  section.classList.remove("hidden");
  section.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("reservationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  const body = {
    room_id: +f.room_id.value,
    guest_name: f.guest_name.value.trim(),
    guest_email: f.guest_email.value.trim(),
    check_in: f.check_in.value,
    check_out: f.check_out.value,
    adults: +f.adults.value,
    children: +f.children.value,
  };

  const res = await fetch("/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    alert("¡Reserva confirmada!");
    f.reset();
    document.getElementById("personalSection").classList.add("hidden");
  } else {
    const err = await res.json();
    alert("Error: " + (err.detail ?? "no se pudo crear la reserva"));
  }
});
