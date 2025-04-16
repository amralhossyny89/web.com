const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

sendBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (!message) return;

  // عرض رسالة المستخدم
  const userMsg = document.createElement("div");
  userMsg.classList.add("message", "user");
  userMsg.textContent = message;
  chatWindow.appendChild(userMsg);

  userInput.value = "";

  // عرض رسالة انتظار
  const botMsg = document.createElement("div");
  botMsg.classList.add("message", "bot");
  botMsg.textContent = "Thinking...";
  chatWindow.appendChild(botMsg);

  // إرسال إلى السيرفر
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    botMsg.textContent = data.reply;
  } catch (error) {
    botMsg.textContent = "Error connecting to ChatGPT.";
  }

  chatWindow.scrollTop = chatWindow.scrollHeight;
});