var socket = io();
$(() => {
    //add click event to the button
    $('#send').click(() => {
        var message = {
            name: $('#name').val(),
            message: $('#message').val()
        };
        console.log(message.message)
        postMessage(message);

    });
    getMessages();
});

socket.on('message', addMessages);

//function to add Messages
function addMessages(message) {
    $('#messages').append(`<h4> ${message.name}</h4> <p>${message.message}</p>`);

}

// Ajax call to receive data from message array or in reealworld an api or a database
function getMessages() {
    $.get('http://localhost:3000/messages', (data) => {
        data.forEach(addMessages);
    })
}

//Ajax post method for new message
function postMessage(message) {
    $.post('http://localhost:3000/messages', message)
}