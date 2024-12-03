
        /************************************   Variables Declaration **********************************************/

var userArray;
var signupNameInput = document.getElementById("signupName");
var signupEmailInput = document.getElementById("signupEmail");
var signupPasswordInput = document.getElementById("signupPassword");
var signinEmailInput = document.getElementById("signinEmail");
var signinPasswordInput = document.getElementById("signinPassword");
var existEle = document.getElementById("exist");
var incorrect = document.getElementById("incorrect");
var correct = document.getElementById("correct");

                 /**************************   for shown password *********************************************/

 function shown () {
  const toggleIcon = document.getElementById("toggleIcon");

  if (signinPasswordInput.type === "password") {
    signinPasswordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    signinPasswordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

               /**************************   Make Function exchangeContent *********************************************/

function updateStorage(){
  localStorage.setItem("users", JSON.stringify(userArray));
}        

               /*****************************   Make Function ClearInputs ********************************************/

function clearForm() {
  signupNameInput.value = null;
  signupEmailInput.value = null;
  signupPasswordInput.value = null;
}

                  /***************************** Get Array From localStorage***********************************/

if (localStorage.getItem("users") !== null) {
  userArray = JSON.parse(localStorage.getItem("users"));
} else {
  userArray = [];
}
             /***************************** Make Helper Function For Duplicate Email***********************************/

function isDuplicateEmail(email, userArray, excludeIndex = -1) {
  const lowerCaseEmail = email.toLowerCase();
  return userArray.some(
    (user, index) => index !== excludeIndex && user.email.toLowerCase() === lowerCaseEmail
  );
}

                 /*****************************   Make Function ValidateRegex ******************************************/


function validate(elm) {
  var regex = {
    signupName: /^[A-Za-z\s]{3,30}$/, 
    signupEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    signupPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 
  };

  var matched = regex[elm.id]?.test(elm.value);

  if (matched) {
    elm.classList.remove("is-invalid");
    elm.classList.add("is-valid");
    elm.nextElementSibling.classList.add("d-none");
  } else {
    elm.classList.remove("is-valid");
    elm.classList.add("is-invalid");
    elm.nextElementSibling.classList.remove("d-none");
  }
  return matched;
}



               /*****************************   Make Function signUP *********************************************/

function signUp() {
  if (!validate(signupNameInput) || !validate(signupEmailInput)|| !validate(signupPasswordInput)) {
    existEle.innerHTML=`<span class="text-danger m-3">All inputs is required</span>`
    return;
  }

  if (isDuplicateEmail(signupEmailInput.value, userArray)) {
    existEle.innerHTML=`<span class="text-danger m-3">email already exists</span>`
    return;
  }else{
    existEle.innerHTML=`<span class="text-success m-3">Successfully </span>`
  }

  const userObject = {
    name: signupNameInput.value,
    email: signupEmailInput.value,
    password: signupPasswordInput.value,
  };
  userArray.push(userObject);
  updateStorage();
  clearForm();

  setTimeout(() => {
    window.location.href = "signin.html"; 
  }, 1000);
  

}

               /*****************************   Make Function Login *********************************************/

function login() {
  const emailInput = signinEmailInput.value; 
  const passwordInput = signinPasswordInput.value; 
  const user = userArray.find(user => user.email.toLowerCase() === emailInput.toLowerCase());
  
  incorrect.innerHTML = "";
  if (!emailInput || !passwordInput) {
    incorrect.innerHTML = `<span class="text-danger m-3">Please fill in all fields</span>`;
    return;
  }
  if (!user) {
    incorrect.innerHTML = `<span class="text-danger m-3">Incorrrect Email</span>`;
    return;
  }

  if (user.password !== passwordInput) {
    incorrect.innerHTML = `<span class="text-danger m-3">Incorrect password</span>`;
    return;
  }
  
  localStorage.setItem('loggedInUser', JSON.stringify(user));
  correct.innerHTML = `<span class="text-success m-3">Login successful! Redirecting to Home...</span>`;
  setTimeout(() => {
    window.location.href =  `home.html?username=${encodeURIComponent(user.name)}`;

  }, 1000);
}

// this for take the paramter of name of user in put in home page
if (window.location.pathname.endsWith("home.html")) {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");
  const usernameEle = document.getElementById("username");
  usernameEle.innerHTML = username
  ? `Welcome ${username} <i class="fa-solid fa-heart fa-beat" style="color: #fff;"></i>` : "Welcome";
}


               /*****************************   Make Function logout *********************************************/


function logout(){
  localStorage.removeItem('loggedInUser');
  window.location.href = 'signin.html';
}


                     /*****************************   Done *********************************************/

