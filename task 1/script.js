let form=document.querySelector(".appointment-section");
let message=document.querySelector("#message");

form.addEventListener("submit",function(event){
    event.preventDefault();;

    let name=document.querySelector("#name").value;

    message.innerText=`book appointment booked successfully,${name}!`;
    form.reset();
})