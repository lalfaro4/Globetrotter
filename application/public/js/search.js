const searchNextButton = document.getElementById("next-btn");
const infoField = document.createElement("div");
const resultText = document.getElementById("result-text");
const submitButton = document.getElementById("submit-btn");
const dataBaseData = document.getElementById("database-data");
const newButton = document.createElement("button");
newButton.innerHTML = "Submit";
newButton.id = "submit-button";



searchNextButton.addEventListener("click", () =>{
    const userSearchOption = document.getElementById("search-choice").value;
    const textField = document.createElement("input");
    textField.type = "text";

    resultText.innerText = `Enter the ${userSearchOption} to get the information: `;
    resultText.appendChild(textField);
    resultText.appendChild(newButton);
})

newButton.addEventListener("click", () => {
    
});