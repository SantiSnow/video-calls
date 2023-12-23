const socket = io('/');

//Get the DOM element that captures the video
const videoGrid = document.getElementById("video-grid");

//Creates a new Peer Objeect
var peer = new Peer(undefined, {
    host: '/',
    port: '3001'
});

//Creates a video HTML element and mutes it by default
const myVideo = document.createElement("video");
myVideo.muted = true;

//Captures the user WebCam and Mic
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
    });

    socket.on('user-connected', (userId) => {
        console.log("User connected: ", userId);
        connectToNewUser(userId, stream)
    });
        
})

//Open the peer and emit the event Join Room
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});



//Functions

/*
 * Add the stream to the Video HTML element and play it
 */
function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

/*
 * Add the stream from new user to the Video HTML element and play it
 */
function connectToNewUser(userId, stream){
    const call = peer.call(userId, stream);
    const video = document.createElement("video")
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });
}