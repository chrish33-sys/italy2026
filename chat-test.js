(function () {
  const log = document.getElementById('chatLog');
  const input = document.getElementById('msgInput');
  const send = document.getElementById('sendBtn');

  function addMessage(text, cls) {
    const div = document.createElement('div');
    div.className = `msg ${cls}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  async function sendMessage() {
    const message = (input.value || '').trim();
    if (!message) return;

    addMessage(`You: ${message}`, 'user');
    input.value = '';
    send.disabled = true;
    send.textContent = 'Sending...';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      if (!res.ok) {
        addMessage(`Bot error: ${JSON.stringify(data, null, 2)}`, 'bot');
      } else {
        addMessage(`Bot: ${data.reply}`, 'bot');
      }
    } catch (err) {
      addMessage(`Network error: ${String(err?.message || err)}`, 'bot');
    } finally {
      send.disabled = false;
      send.textContent = 'Send';
      input.focus();
    }
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
