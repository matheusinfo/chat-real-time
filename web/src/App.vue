<script setup>
import { io } from 'socket.io-client';
import { onBeforeMount, ref } from 'vue';

const socket = io('http://localhost:3333');

const messages = ref([]);
const messageText = ref('');
const joinedChat = ref(false);
const userName = ref('');
const typingDisplay = ref('');

onBeforeMount(() => {
  socket.emit('findAllMessages', {}, (response) => {
    messages.value = response
  })

  socket.on('message', (message) => {
    messages.value.push(message)
  })

  socket.on('typing', ({ name, isTyping}) => {
    if(isTyping){
      return typingDisplay.value = `${name} is typing...`
    }

    return typingDisplay.value = '';
  })
})

const joinChat = () => {
  if(userName.value.trim().length !== 0){
    socket.emit('join', { name: userName.value }, () => {
      joinedChat.value = true;
    })
  }
}

const sendMessage = () => {
  if(messageText.value.trim().length !== 0){
    socket.emit('createMessage', { text: messageText.value}, () => {
      messageText.value = '';
    })

    socket.emit('typing', { isTyping: false })
  }
}

const emitTyping = () => {
  socket.emit('typing', { isTyping: true })

  setTimeout(() => {
    socket.emit('typing', { isTyping: false })
  }, 3000)
}

</script>

<template>
  <div class="chat">
    <div class="chat-menu" v-if="!joinedChat">
      <form @submit.prevent="joinChat">
        <label>What's your name?</label>
        <input v-model="userName" type="text" />
        <button type="submit">
          enter
        </button>
      </form>
    </div>

    <div class="chat-container" v-else>
      <div class="messages-container">
        <div v-for="message in messages">
          {{ message.name }}: {{ message.text }} [{{ message.date }}]
        </div>
      </div>

      <div v-if="typingDisplay">
        {{ typingDisplay }}
      </div>

      <hr />

      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <input v-model="messageText" @input="emitTyping" type="text" />
          <button type="submit">Send</button>
        </form>
      </div>    
    </div>
  </div>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
  
  * {
    background: #1B1A1A;
    color: whitesmoke;
    font-family: 'Anton', sans-serif;
  }

  .chat{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .chat-menu form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .chat-menu form label {
    font-size: 30px;
    margin-bottom: 10px;
  }

  .chat-menu form input {
    font-size: 25px;
    padding: 5px;
    margin: 30px 0px;
    width: 300px;
    border-radius: 2px;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .chat-menu form button {
    font-size: 20px;
    width: 100px;
    border-radius: 2px;
    background: #DB4444;
    cursor: pointer;
  }

  .chat-container {
    max-width: 480px;
  }

  .chat-container .messages-container div {
 
    word-wrap: break-word;
    padding: 2px;
    color: #323232;
    background: whitesmoke;
  }

  .chat-container .message-input form{
    margin-top: 10px;
  }

  .chat-container .message-input input{
    background: whitesmoke;
    color: #000;
    width: 400px;
  }

  .chat-container .message-input button{
    margin-left: 5px;
    background: #DB4444;
    width: 65px;
  }
</style>