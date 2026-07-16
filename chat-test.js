(function () {
  const log = document.getElementById('chatLog');
  const input = document.getElementById('msgInput');
  const send = document.getElementById('sendBtn');
  const notice = document.getElementById('chatDisabledNotice');

  let chatEnabled = true;

  function addMessage(text, cls) {
    const div = document.createElement('div');
    div.className = `msg ${cls}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function disableChatUI(reason) {
    chatEnabled = false;
    input.disabled = true;
    send.disabled = true;
    input.placeholder = 'Chat is temporarily disabled';
    if (notice) notice.style.display = 'block';
    if (reason) addMessage(`Bot: ${reason}`, 'bot');
  }

  async function sendMessage() {
    const message = (input.value || '').trim();
    if (!message || !chatEnabled) return;

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
        if (data?.code === 'chat_disabled') {
          disableChatUI('Chat is temporarily disabled. Coming soon.');
        } else {
          addMessage('Bot: Sorry, chat is unavailable right now. Please try again later.', 'bot');
        }
      } else {
        addMessage(`Bot: ${data.reply}`, 'bot');
      }
    } catch (err) {
      addMessage('Bot: Network error. Please try again.', 'bot');
    } finally {
      if (chatEnabled) {
        send.disabled = false;
        send.textContent = 'Send';
        input.focus();
      }
    }
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
