const socket=io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-loc')
const $messages=document.querySelector('#message')
const $sidebar=document.querySelector('#sidebar')


//templlates

const msgtemplate=document.querySelector('#message-template').innerHTML
const loctemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


const {username, room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoScroll=()=>{
    $messages.scrollTop=$messages.scrollHeight
}

socket.on('message', (message) => {
    console.log(message)
    const html=Mustache.render(msgtemplate,{
        username:message.username,
        Message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html
})

socket.on('locMessage',(message)=>{
    //console.log(url)
    const html=Mustache.render(loctemplate,{
        username:message.username,
        Url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})


document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = $messageFormInput.value

    socket.emit('sendMessage', message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('message was delivered')
    })
})

document.querySelector('#send-loc').addEventListener('click',()=>{
    
    if(!navigator.geolocation){
        return alert('you browser doesnt support this function')
    }

    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        //console.log(position)
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
            
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('location shared')

        })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})
// socket.on('message',(msg)=>{
//  console.log(msg)
// })
// // socket.on('CountUpdated',(count)=>{
// //     console.log('count has been updated' + count)
// // })

// document.querySelector('#inc').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('inc')
// })
