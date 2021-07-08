const searchNextButton = document.getElementById("next-btn");
const infoField = document.createElement("div");
const resultText = document.getElementById("result-text");
const submitButton = document.getElementById("submit-btn");
const dataBaseData = document.getElementById("database-data");
const searchButton = document.createElement("button");
searchButton.innerHTML = "Submit";
searchButton.id = "submit-button";



async function authenticate() {
    var url = new URL("http://localhost:3000/api/authenticate"),			/* Hopefully we can find a way to write this without 'localhost' since the backend will not always be at localhost. */
        params = { username: 'user2', password: '1234' }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    var response = await fetch(url, {
        method: "GET"
    });
    return (await response.json()).token;
}



// async function searchUsers(token, searchString, searchType) {
//     var url = new URL("http://localhost:3000/api/users/search"),			/* Hopefully we can find a way to write this without 'localhost' since the backend will not always be at localhost. */
//         // params = {`${searchType}`: searchString }
//         //params[searchType] = searchString
//         var parameters;
//     if(searchType == 'username') {
//         parameters = { username: searchString };
//     } else if(searchType == 'email') {
//         parameters = { email: searchString };
//     }
//     var url = new URL("http://localhost:3000/api/users/search%22),            /* Hopefully we can find a way to write this without 'localhost' since the backend will not always be at localhost. */
//         params = parameters
//         Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
//     var response = await fetch(url, {
//         method: "GET",
//         headers: new Headers({
//             'Authorization': `Bearer ${token}`,
//         })
//     });
//     return await response.text();
// }

async function searchUsers(token, searchString, searchType) {
    var parameters;
    if(searchType == 'username') {
        parameters = { username: searchString };
    } else if(searchType == 'email') {
        parameters = { email: searchString };
    }
    var url = new URL("http://localhost:3000/api/users/search"),            /* Hopefully we can find a way to write this without 'localhost' since the backend will not always be at localhost. */
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



searchNextButton.addEventListener("click", () => {
    const userSearchOption = document.getElementById("search-choice").value;
    const searchParameterField = document.createElement("input");
    searchParameterField.id = 'searchParameterField';
    searchParameterField.type = "text";

    resultText.innerText = `Enter the ${userSearchOption} to get the information: `;
    resultText.appendChild(searchParameterField);
    resultText.appendChild(searchButton);
})

searchButton.addEventListener("click", async () => {
    var searchString = document.getElementById("searchParameterField").value;
    var searchType = document.getElementById("search-choice").value.toLowerCase();
    var token = await authenticate();
    console.log(`Searching for users containing '${searchString}'`);
    console.log(`Searching for users containing '${searchType}'`);
    var result = await searchUsers(token, searchString, searchType);
    var databaseDataTextArea = document.getElementById('database-data');
    databaseDataTextArea.innerText = result;
});