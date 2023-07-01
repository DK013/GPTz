var isFirstLoad = true;
let stream;

async function executeOnFirstLoad() {
  if (isFirstLoad) {
    isFirstLoad = false;

    await zoomSdk.config({
        version: "0.16",
        popoutSize: {width: 480, height: 720},
        capabilities: [
            // "getMeetingContext",
            "getMeetingJoinUrl",
            "openUrl"
        ]
    })
    
    // zoomSdk.getMeetingContext().then(async (context) => {
    //     var response = await fetch('/api/v1/getContext/'+context.meetingID);
    //     const data = await response.json();
        
    //     if(response.ok) {
    //         document.getElementById('auth').classList.add('hidden');
    //         document.getElementById('app').classList.remove('hidden');
    //         document.getElementById('meeting_number').value = data.meetingId;
    //         document.getElementById('jwt').value = data.meetingJWT;
    //         document.getElementById('token').value = data.accessToken;
    //         document.getElementById('app').classList.remove('hidden');
    //         document.getElementById('auth').classList.add('hidden');
    //     } else {
    //         document.getElementById('auth').classList.remove('hidden');
    //         document.getElementById('app').classList.add('hidden');
    //     }
    // }).catch((error) => {
    //     console.error(error);
    // });
    
  }
}

$('#loginBtn').on('click', async (e)=>{
    e.preventDefault();
    const meetingUrl = await zoomSdk.getMeetingJoinUrl();
    
    const response = await fetch('/api/v1/getAuthUrl');
    const data = await response.json();
    
    if(response.ok) {
        const url = meetingUrl ? `${data.url}/?link=${encodeURI(meetingUrl.joinURL)}` : data.url;
        await zoomSdk.openUrl({ url: url });
        await fetch('/api/v1/log/'+url);
    }
    else {
        $('#auth').append('<div class="alert alert-danger mt-3 w-100" role="alert">\
            Failed to fetch login URL from server\
        </div>');
    }
})

window.onload = executeOnFirstLoad;