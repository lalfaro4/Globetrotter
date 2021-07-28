

async function saveProfileClickHandler(event) {
    var form = document.getElementById('account-management-profile-form');
    var formData = new FormData(form);
    var formBody = [];
    for (var [key, value] of formData.entries()) {
        formBody.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
    formBody = formBody.join('&');
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    };    
    // delete options.headers['Content-Type'];
    var result = await fetch('/api/users/me/update', options);
    location.reload();
}

document.getElementById("account-management-submit-button").addEventListener('click', saveProfileClickHandler);