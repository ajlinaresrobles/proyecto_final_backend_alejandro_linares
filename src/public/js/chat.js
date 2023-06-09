const socketClient = io();

const chatEmail = document.getElementById("chatEmail");
const chatInput = document.getElementById("chatInput");
const btn_sendMessage = document.getElementById("btn_sendMessage");
const getMessages = document.getElementById("getMessages");


btn_sendMessage.addEventListener("click", ()=>{

    const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

	if( !validEmail.test(chatEmail.value) ){
		alert(`${chatEmail.value} no cumple con el formato de correo electrónico`);
	}else{

    socketClient.emit("message", {
        user: chatEmail.value,
        message: chatInput.value
    });
    chatInput.value = "";
}
});

socketClient.on("MessageHistory", (data)=>{
    console.log(data);
    
    getMessages.innerHTML = "";
    data.forEach(element => {
        const parrafo = document.createElement("p");
        parrafo.innerHTML = `${JSON.stringify(element)}`;
        getMessages.appendChild((parrafo));
    });
});