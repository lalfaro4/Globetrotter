const addButton = document.getElementById("add-img-btn");
const grid = document.getElementById("images-container");
const saveButton = document.getElementById("save-btn");



/*************************************************************************************
 * Grabs the current protocol, host, and port being used to access the website.
 * 
 * Use this in place of localhost:port
 *************************************************************************************/
function getURLBase() {
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}

// Use to fetch a URL with GET.
async function fetchURL(method, endpoint, parameters) {
    var url = new URL(getURLBase() + endpoint),
        params = parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    console.log(url);
    var response = await fetch(url, {
        method: method,
        headers: new Headers({
            // 'Authorization': `Bearer ${token}`,
        })
    });
    return response;
}

async function loadUserList(userSearchInput, datalistElement) {
    var userResults = await (await fetchURL('GET', '/api/users/search', { username: userSearchInput.value })).json();
    if (userResults) {
        console.log(userResults);
        datalistElement.innerHTML = '';
        for (var user of userResults) {
            var option = document.createElement('option');
            option.value = user.username;
            option.setAttribute('data-value', user.user);
            datalistElement.appendChild(option);
        }
    }
}


// Setup the airport search autocomplete
async function userSearchInputEventHandler(event) {

    var userSearchInput = event.target;
    var datalistElement = document.getElementById('photogallery-user-search-datalist');

    await loadUserList(userSearchInput, datalistElement);

}

async function inviteUserEventHandler(event) {
    var username = document.getElementById('photogallery-user-search-input').value;
    if(username == '') {
        alert('Please enter a username first.');
        return;
    }
    var result = await fetchURL('POST', `${window.location.pathname}/invitedusers/${username}`, []);
    location.reload();
}

// Everytime a user click the "+" button, the getRandomDogURL function gets called.
// addButton.addEventListener("click", getRandomDogURL);

// saveButton.addEventListener('click', (event) => { window.location.href = 'public/html/purchasedtrips.html'});

// This function gets called anytime the user hits the "+" button in the photo gallery. It displays an image of a puppy
// for now. Will be made so that it will actually upload an image later on.
function getRandomDogURL() {



    const image = document.createElement("img");

    fetch('https://random.dog/woof.json')
        .then(res => res.json())
        .then(data => {
            if (data.url.includes('.jpg') || data.url.includes('.mp4') || data.url.includes('.gif')) {
                getRandomDogURL();
            } else {
                image.src = data.url;
                grid.appendChild(image);

            }

        })



}

document.getElementById('photogallery-user-search-input').addEventListener('input', userSearchInputEventHandler);
document.getElementById('photogallery-invite-user-button').addEventListener('click', inviteUserEventHandler);