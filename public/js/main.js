window.onerror = function(e){
    document.getElementById('log').innerHTML = e.toString();
}
$(document).ready(async function() {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('id')) {
        $('#zoomlink').val(urlParams.get('id'));
    }
    if(urlParams.get('error')) {
        $('#joinForm').append('<div class="alert alert-danger mt-3" role="alert">Authentication Failed</div>');
    }
});

$('#joinForm').on('submit', async function(e) {
    e.preventDefault();
    e.stopPropagation();

    let id, pass, mode;

    var input = $('#zoomlink').val();

    if(input.length < 1) {
        $('#joinForm').append('<div class="alert alert-danger mt-3" role="alert">Please Enter a Metting Link</div>');
        return;
    }

    if(input.startsWith('http')) {
        mode = 'link';
        var link = input.split('/');
        var token = link[link.length - 1].split('?');
        id = token[0];
        const urlParams = new URLSearchParams(token[1]);
        pass = urlParams.get('pwd');
    }
    else {
        mode = 'number';
        id = input;
        pass = '';
    }

    const response = await fetch('/api/v1/jwt', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({meetingId: id, password: pass})
    });
    const jsonData = await response.json();
    if(response.ok) {
        if(mode === 'number')
            window.location.href = '/install';
        else
            window.location.href = '/meeting';
    }
    else {
        $('#joinForm').append('<div class="alert alert-danger mt-3" role="alert">Something went wrong. Check Console for details.</div>')
        console.log(json.error);
    }
})

async function getAccessToken() {
    const urlParams = new URLSearchParams(window.location.search);
    var response = await fetch('/api/v1/auth/'+urlParams.get('code'));
    const data = await response.json();
    return data;
}

const getJoinToken = async (id) => {
    var accessToken = await getAccessToken();
    
    const response = await fetch('/api/v1/token', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: id, token: accessToken.access_token})
    });
    
    const jsonData = await response.json();

    if(response.ok) {
        $('#jointoken').val(jsonData.token);
    }
    else {
        $('#joinForm').append('<div class="alert alert-danger mt-3" role="alert">Something went wrong. Check Console for details.</div>')
        console.log(json.error);
    }
}

var clipboard = new ClipboardJS('.copyBtn');