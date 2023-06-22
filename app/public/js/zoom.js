var isFirstLoad = true;

async function executeOnFirstLoad() {
  if (isFirstLoad) {
    isFirstLoad = false;

    await zoomSdk.config({
        version: "0.16",
        popoutSize: {width: 480, height: 720},
        capabilities: [
            "getMeetingContext",
        ]
    })
    
    zoomSdk.getMeetingContext().then(async (context) => {
        var response = await fetch('/api/v1/getContext/'+context.meetingID);
        const data = await response.json();
        
        if(response.ok) {
            if(!data.error) {
                $('#app').removeClass('hidden');
                $('#auth').addClass('hidden');
                document.getElementById('meeting_number').value = data.meetingId;
                document.getElementById('jwt').value = data.meetingJWT;
                document.getElementById('token').value = data.accessToken;
            } else {
                $('#app').addClass('hidden');
                $('#auth').removeClass('hidden');
            }
        }
    }).catch((error) => {
        console.error(error);
    });
    
  }
}

window.onload = executeOnFirstLoad;