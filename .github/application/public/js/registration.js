var userPasswordInput = document.getElementById("password");
var length = document.getElementById("length");
var specialChar = document.getElementById("special-char");
var lowerCaseLetter = document.getElementById("lower-case-letter");
var passwordRequirements = document.getElementById("password-requirements");
var capitalLetter = document.getElementById("capital-letter");
var createAccountButton = document.getElementById("create-account-button");
var confirmPasswordInput = document.getElementById("confirm-password");

// When the "Create Account" button gets clicked, this function will get called and
// it will check if the password field value is the same as the confirm password
// value field. If it is not, it will not let the user continue and it will 
// highlight the texts fields in red. If they are the same, it will jump to the
// saveRegistrationClickHandler function where the account will be created.
createAccountButton.onsubmit = function () {
  var passwordValue = userPasswordInput.value;
  var confirmPasswordValue = confirmPasswordInput.value;

  if (passwordValue !== confirmPasswordValue) {
    alert("The passwords provided do not match!");
    userPasswordInput.value = "";
    confirmPasswordInput.value = "";
    userPasswordInput.style.border = "red solid 1px";
    confirmPasswordInput.style.border = "red solid 1px";
    return;
  }
  else {
    saveRegistrationClickHandler();
  }
}


async function saveRegistrationClickHandler(event) {
  var form = document.getElementById('registration-profile-form');
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
  var result = await fetch('/users/register', options);
  location.href = result.url;
}



//When the window loads, the password requirements container will not be visible.
window.onload = function () {
  passwordRequirements.style.display = "none";

  const urlParams = new URLSearchParams(window.location.search);
  var message = urlParams.get('message');
  if (message) {
    alert(message);
  }
}

// When the user clicks outside of the password field, hide the message box that
// shows the requirements of the password.
userPasswordInput.onblur = function () {
  passwordRequirements.style.display = "none";
}

// When the user clicks on the password input, display the requirements for the password.
userPasswordInput.onfocus = function () {
  passwordRequirements.style.display = "block";
}


//This function will invoke everytime a user realeases a key on the keyboars.
//It is used let the user know which, if any, password requirements they have met as they 
//are typing.
userPasswordInput.onkeyup = function () {

  //This first if-else block will check if the user has entered a lower case letter.
  var lowerCaseLetters = /[a-z]/g;
  if (userPasswordInput.value.match(lowerCaseLetters)) {
    lowerCaseLetter.classList.remove("failed");
    lowerCaseLetter.classList.add("passed");
  } else {
    lowerCaseLetter.classList.remove("passed");
    lowerCaseLetter.classList.add("failed");
  }

  //This if-else block will check if the user has entered a capital letter.
  var upperCaseLetters = /[A-Z]/g;
  if (userPasswordInput.value.match(upperCaseLetters)) {
    capitalLetter.classList.remove("failed");
    capitalLetter.classList.add("passed");
  }
  else {
    capitalLetter.classList.remove("passed");
    capitalLetter.classList.add("failed");
  }

  //This if-else block will check if the user has entered a password longer than 8 characters.
  if (userPasswordInput.value.length >= 8) {
    length.classList.remove("failed");
    length.classList.add("passed");
  }
  else {
    length.classList.remove("passed");
    length.classList.add("failed");
  }

  //This if-else block will check if the user has entered a special character.
  var specialCharacters = /[!@#$%^&*_+]/g;

  if (userPasswordInput.value.match(specialCharacters)) {
    specialChar.classList.remove("failed");
    specialChar.classList.add("passed");
  }
  else {
    specialChar.classList.remove("passed");
    specialChar.classList.add("failed");
  }
}
