$('#joinForm').on('submit', async function(e) {
    e.preventDefault();
    e.stopPropagation();

    let id;

    var input = $('#zoomlink').val();
    var role = $('#zoomrole').val();

    if(input.length < 1) {
        $('#joinForm').append('<div class="alert alert-danger mt-3" role="alert">Please Enter a Metting Link</div>');
        return;
    }
    if(role === "") {
        $('#joinForm').append('<div class="alert alert-danger mt-3" role="alert">Please Select Your Role</div>');
        return;
    }

    if(input.startsWith('http')) {
        var link = input.split('/');
        var token = link[link.length - 1].split('?');
        id = token[0];
    }
    else
        id = input;

    const response = await fetch('/api/v1/jwt', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({meetingId: id, role: role})
    });
    const jsonData = await response.json();
    if(response.ok) {
        $('#joinForm').addClass('hidden');
        $('#app').removeClass('hidden');
        $('#token').val(jsonData.signature);
    }
    else {
        $('#joinForm').append('<div class="alert alert-danger mt-3" role="alert">Something went wrong. Check Console for details.</div>')
        console.log(json.error);
    }
})
