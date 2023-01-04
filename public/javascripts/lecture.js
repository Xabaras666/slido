const button = document.getElementById('delete');
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