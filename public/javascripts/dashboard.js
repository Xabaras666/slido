const shareButtons = document.querySelectorAll('.share');

for(let i = 0; i < shareButtons.length; i++) {
    let id = shareButtons[i].id;

    shareButtons[i].addEventListener('click', e => {
        fetch( '/share/' + id , {method: 'GET'}).then((response) => {
            if(response.ok) {
                return;
            }
            throw new Error('Request failed.');
        })
            .catch((error) => {
                console.log(error);

            })
    })
}