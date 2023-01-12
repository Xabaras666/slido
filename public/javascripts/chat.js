const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chatbox');
const socket = io();


let lineNum = 0;
let code = document.getElementById('code').innerHTML;

socket.emit('joinRoom', code);

socket.on('message', message => {
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;

})

socket.on('answer', (answer) => {

    outputAnswer(answer.ans, answer.ID);
});


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
    div.setAttribute('id', message.id[0].question_id)

    div.innerHTML = `<p style="padding-right: 1rem">${chatMessages.childElementCount / 2}</p>
                     <p>${message.question}</p>`;

    document.querySelector('.chatbox').appendChild(div)

    const div2 = document.createElement('div');
    div2.setAttribute('id', "answers" + message.id[0].question_id)
    document.querySelector('.chatbox').appendChild(div2)

}

function outputAnswer(answer, id) {
    const div = document.createElement('div');
    div.innerHTML = `<p class="answered">${answer}</p>`
    let ID = "answers" + id

    document.getElementById(ID).appendChild(div)
}

// GRADE LECTURE
