const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chatbox');
const socket = io();


let lineNum = 0;
let code = document.getElementById('code').innerHTML;

socket.on('message', message => {
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;

})


// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg, code)

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('line');

    div.innerHTML = `<p style="padding-right: 1rem">${chatMessages.childElementCount}</p>
                     <p>${message}</p>`;

    document.querySelector('.chatbox').appendChild(div)
}
