const answerForm = document.querySelectorAll('.answer-form')
const button = document.getElementById('delete');
const chatMessages = document.querySelector('.chatbox');
const socket = io();


let code = document.getElementById('code').innerHTML;

socket.emit('joinRoom', code);

socket.on('message', message => {
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;

})

socket.on('answer', (answer) => {

    outputAnswer(answer.ans, answer.ID);
});

loadForms(answerForm)


// Answer submit

function outputMessage(message) {

    const div = document.createElement('div')
    div.classList.add('line');

    div.innerHTML = `<p style="padding-right: 1rem">${chatMessages.childElementCount / 3}</p>
                     <p>${message.question}</p>`;

    document.querySelector('.chatbox').appendChild(div)

    const div2 = document.createElement('div');
    div2.setAttribute('id', message.id[0].question_id)

    document.querySelector('.chatbox').appendChild(div2)

    const div3 = document.createElement('div')
    div3.classList.add('answer')

    const form = document.createElement('form');
    form.setAttribute('id', message.id[0].question_id)
    form.classList.add("answer-form");
    form.innerHTML = `<input id="msg" type="text" placeholder="EnterAnswer" required autocomplete="off">
                        <button type="submit" id="answer-btn"><img style="height: 1rem;" src="/images/next.png" alt="next"></button>`

    div3.appendChild(form);

    document.querySelector('.chatbox').appendChild(div3)

    loadForms(answerForm)
}

function outputAnswer(answer, id) {
    console.log(id)
    const p = document.createElement('p');
    p.classList.add('answer');

    p.innerHTML = `${answer}`;

    document.getElementById(id).appendChild(p)
}

function loadForms(answerForm) {
    answerForm = document.querySelectorAll('.answer-form')

    for(let i = 0; i < answerForm.length; i++) {
        answerForm[i].addEventListener('submit', (e) => {
            e.preventDefault();

            const answer = e.target.elements.msg.value;
            const id = e.target.id;

            socket.emit('answerMessage', answer, code, id)

            e.target.elements.msg.value = '';
        })
    }
}


button.addEventListener('click', function(e) {
    fetch(window.location.href + '/delete' , {method: 'POST'}).then((response) => {
        if(response.ok) {
            return;
        }
        throw new Error('Request failed.');
    })
        .catch((error) => {
            console.log(error);
        })

});
