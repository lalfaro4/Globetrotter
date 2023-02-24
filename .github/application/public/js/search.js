const searchNextButton = document.getElementById("next-btn");
const infoField = document.createElement("div");
const resultText = document.getElementById("result-text");
const submitButton = document.getElementById("submit-btn");
const dataBaseData = document.getElementById("database-data");
const searchButton = document.createElement("button");
searchButton.innerHTML = "Submit";
searchButton.id = "submit-button";



/*************************************************************************************
 * Grabs the current protocol, host, and port being used to access the website.
 * 
 * Use this in place of localhost:port
 *************************************************************************************/
function getURLBase() {
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}



/*************************************************************************************
 * Authenticates the user with and returns the authorization token.
 *************************************************************************************/
async function authenticate() {
    var url = new URL(getURLBase() + "/api/authenticate"),
        params = { username: 'globetrotter', password: 'globetrotter' }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    var response = await fetch(url, {
        method: "GET"
    });
    return (await response.json()).token;
}



/*************************************************************************************
 * Calls the /api/users/search API endpoint and sends either a 'username' or 'email'
 * parameter with a value equal to searchString. Returns any users that were found 
 * with a matching username or email attribute.
 *************************************************************************************/
async function searchUsers(token, searchString, searchType) {
    var parameters;
    if (searchType == 'username') {
        parameters = { username: searchString };
    } else if (searchType == 'email') {
        parameters = { email: searchString };
    } else {
        return JSON.stringify({ result: "Invalid search type." });
    }
    var url = new URL(getURLBase() + "/api/users/search"),
        params = parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    var response = await fetch(url, {
        method: "GET",
        headers: new Headers({
            'Authorization': `Bearer ${token}`,
        })
    });
    return await response.text();
}



/*************************************************************************************
 * Setup event handler for the searchNextButton
 *************************************************************************************/
searchNextButton.addEventListener("click", () => {
    const userSearchOption = document.getElementById("search-choice").value;
    const searchParameterField = document.createElement("input");
    searchParameterField.id = 'searchParameterField';
    searchParameterField.type = "text";

    resultText.innerText = `Enter the ${userSearchOption} to get the information: `;
    resultText.appendChild(searchParameterField);
    resultText.appendChild(searchButton);
})



/*************************************************************************************
 * Setup the event handler for the searchButton.
 *************************************************************************************/
searchButton.addEventListener("click", async () => {
    var searchString = document.getElementById("searchParameterField").value;
    var searchType = document.getElementById("search-choice").value.toLowerCase();
    var token = await authenticate();
    console.log(`Searching for users with '${searchType}' containing '${searchString}'`);
    var result = await searchUsers(token, searchString, searchType);
    var databaseDataTextArea = document.getElementById('database-data');
    databaseDataTextArea.innerText = result;
});