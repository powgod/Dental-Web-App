const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");

function appendMessage(content, type) {
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.textContent = content;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage(input, "user");
  userInput.value = "";

  appendMessage("⏳ Thinking...", "bot");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": ""
      },
      body: JSON.stringify({
        model: "gpt-4o", // or "gpt-3.5-turbo"
        messages: [
          { role: "system", content: "You are a helpful dental assistant." },
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();

    // Check if OpenAI returned an error
    if (data.error) {
      appendMessage("❌ Error: " + data.error.message, "bot");
      return;
    }

    const reply = data.choices[0].message.content.trim();
    appendMessage(reply, "bot");
  } catch (err) {
    appendMessage("❌ No response from AI: " + err.message, "bot");
    console.error(err);
  }
}