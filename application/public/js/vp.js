async function apiCall() {
    var data = document.getElementById("param-text").value;
    var url = new URL("http://localhost:3000/api"),			/* Hopefully we can find a way to write this without 'localhost' since the backend will not always be at localhost. */
        params = { param: data }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    var response = await fetch(url, {
        method: "GET"
    });
    var text = await response.text();
    return text;
}

document.getElementById("api-button")
    .addEventListener("click", function (e) {
        apiCall()
        .then((result) => {
            document.getElementById("output-text").value = result;
        });
    }
);