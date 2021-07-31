var userPasswordInput = document.getElementById("password");
var length = document.getElementById("length");
var specialChar = document.getElementById("special-char");
var lowerCaseLetter = document.getElementById("lower-case-letter");
var passwordRequirements = document.getElementById("password-requirements");
var capitalLetter = document.getElementById("capital-letter");



//When the window loads, the password requirements container will not be visible.
window.onload = function(){
    passwordRequirements.style.display = "none";
}

// When the user clicks outside of the password field, hide the message box that
// shows the requirements of the password.
userPasswordInput.onblur = function() {
    passwordRequirements.style.display = "none";
}

// When the user clicks on the password input, display the requirements for the password.
userPasswordInput.onfocus = function() {
    passwordRequirements.style.display = "block";
}


//This function will invoke everytime a user realeases a key on the keyboars.
//It is used let the user know which, if any, password requirements they have met as they 
//are typing.
userPasswordInput.onkeyup = function() {

//This first if-else block will check if the user has entered a lower case letter.
  var lowerCaseLetters = /[a-z]/g;
  if(userPasswordInput.value.match(lowerCaseLetters)) {
    lowerCaseLetter.classList.remove("failed");
    lowerCaseLetter.classList.add("passed");
  } else {
    lowerCaseLetter.classList.remove("passed");
    lowerCaseLetter.classList.add("failed");
}

//This if-else block will check if the user has entered a capital letter.
  var upperCaseLetters = /[A-Z]/g;
  if(userPasswordInput.value.match(upperCaseLetters)) {
    capitalLetter.classList.remove("failed");
    capitalLetter.classList.add("passed");
  } 
  else {
    capitalLetter.classList.remove("passed");
    capitalLetter.classList.add("failed");
  }

//This if-else block will check if the user has entered a password longer than 8 characters.
  if(userPasswordInput.value.length >= 8) {
    length.classList.remove("failed");
    length.classList.add("passed");
  } 
  else {
    length.classList.remove("passed");
    length.classList.add("failed");
  }

//This if-else block will check if the user has entered a special character.
  var specialCharacters = /[!@#$%^&*_+]/g;

  if(userPasswordInput.value.match(specialCharacters)){
    specialChar.classList.remove("failed");
    specialChar.classList.add("passed");
  }
  else {
    specialChar.classList.remove("passed");
    specialChar.classList.add("failed");
  }
}
