
      function setUsername(socket, event) {
        var username = prompt('Please tell me your name');       
        socket.emit(event, username);                    
      };
      var socket = io();

      // submit text message without reload/refresh the page
      $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('chat_message', $('#txt').val());
        $('#txt').val('');
        return false;
      });
      
/* 
        $.('#changeName').click(function(e) {
          setUsername(socket);
        });
        */     

      // append the chat text message
        socket.on('chat_message', function(msg){
        $('#messages').append($('<li>').html(msg));
      });

      // append text if someone is online
      socket.on('is_online', function(username) {
        $('#messages').append($('<li>').html(username));
      });

      // ask username
      setUsername(socket, 'username');

      $(document).ready(function() {
        $('#changeName').click(function() {
          setUsername(socket, 'rename');

        });
      });

