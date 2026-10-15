const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const message = document.getElementById("message");
const actions = document.getElementById("actions");

yesButton.addEventListener("click", async () => {
  yesButton.disabled = true;
  noButton.disabled = true;
  message.textContent = "Sending your answer…";

  const endpoint = (window.SITE_CONFIG && window.SITE_CONFIG.notifyEndpoint || "").trim();
  if (!endpoint) {
    message.textContent = "The yes button works, but email alerts aren't configured yet. Ask the site owner to finish setup.";
    yesButton.disabled = false;
    noButton.disabled = false;
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answer: "yes",
        page: window.location.origin,
        submittedAt: new Date().toISOString()
      })
    });
    if (!response.ok) throw new Error("Notification request failed");
    message.textContent = "Your answer has been sent. Thank you for being honest. ♡";
    actions.hidden = true;
  } catch (error) {
    message.textContent = "We couldn't send the answer right now. Please try again in a moment.";
    yesButton.disabled = false;
    noButton.disabled = false;
  }
});

noButton.addEventListener("click", () => {
  message.textContent = "Thank you for being honest. You don't have to explain.";
  actions.hidden = true;
});
