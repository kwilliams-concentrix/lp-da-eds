function getMessageTypeStyle(type) {
  switch (type) {
    case 'error':
      return 'border-2 border-red-500 bg-red-50 text-black';
    case 'success':
      return 'border-2 border-green-500 bg-green-50 text-black';
    case 'info':
    case 'notice':
      return 'border-2 border-blue-500 bg-blue-50 text-black';
    case 'warning':
      return 'border-2 border-yellow-500 bg-yellow-50 text-black';
    default:
      return 'bg-gray-100 text-black';
  }
}

window.displayMessage = function displayMessage(message) {
  const container = document.getElementById('messages-container');
  if (!container) {
    console.warn(
      'Unable to find messages container to display message',
      message,
    );
    return;
  }

  const div = document.createElement('div');

  if (message) {
    const messageTypeStyle = getMessageTypeStyle(message.type);

    div.classList.add('message-container');
    div.innerHTML = `<div
      class="message flex items-center justify-between w-full p-2 pl-5 shadow rounded font-semibold mb-2 ${messageTypeStyle}"
      ui-id="message-${message.type}"
    >
        <span>${message.text}</span>
        <button type="button" class="p-2 text-gray-600 hover:text-black bg-transparent shadow-none hover:bg-transparent" aria-label="Close message" onclick="removeMessage(event);">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="stroke-current" width="18" height="18" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>`;
  }

  container.append(div);
};

window.removeMessage = (event) => {
  const message = event.target.closest('.message-container');
  message.remove();
};

export default function decorate(block) {
  const div = document.createElement('div');
  div.classList.add('messages', 'container', 'py-3', 'empty:hidden');
  div.setAttribute('id', 'messages-container');

  block.append(div);
}
