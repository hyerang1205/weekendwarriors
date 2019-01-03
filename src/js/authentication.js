function redirectToHomePage() {
    window.location.href = 'home.html';
}

function signUp() {
    let email = document.getElementById("upEmail").value;
    let pw = document.getElementById("upPassword").value;
    let cfpw = document.getElementById("upPasswordConfirm").value;
    let userName = document.getElementById("upName").value;


    if (email && pw && cfpw && userName) {
        if (!isBcitEmail(email)) {
            // Please use the BCIT email (my.bcit.ca).
            document.getElementById("emailError").innerHTML = "Please use the BCIT email (my.bcit.ca)."
        } else if (pw != cfpw) {
            // The password does not match.
            document.getElementById("passwordConfirmError").innerHTML = "The password does not match."

        } else {
            firebase.auth().createUserWithEmailAndPassword(email, pw).catch(function (error) {
                var errorMessage = error.message;
            });
            addUserToJson(userName, email);
            setTimeout(function() {
                login(email, pw);
            }, 500);
        }
    } else {
        // Please fill in the blanks.
    }
}

function signIn() {
    let email = document.getElementById("inEmail").value;
    let pw = document.getElementById("inPassword").value;
    login(email, pw);
}

function login(email, pw) {
    let isLoggedIn = true;
    if (email && pw) {
        firebase.auth().signInWithEmailAndPassword(email, pw).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode) {
                document.getElementById('inErrorMessage').innerHTML = errorMessage;
                console.log("Failed to login");
                isLoggedIn = false;
            }
        });
    }
    setTimeout(function () {
        if (isLoggedIn) {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    var email = user.email;
                    var uid = user.uid;
                    redirectToHomePage();
                }
            });
        }
    }, 700);
}
function isBcitEmail(email) {
    let re = /\w+[@]my[.]bcit[.]ca/;

    if (re.exec(email) != null) {
        return true;
    } else {
        return false;
    }
}

function addUserToJson(userName, email) {
    let re = /(\w+)[@]my[.]bcit[.]ca/;
    let result = re.exec(email)[1];
    let ref = firebase.database().ref("users");
    ref.update({
        [result]: {
            name: userName
        }
    });
}
document.getElementById("signUpButton").onclick = signUp;
document.getElementById("signInButton").onclick = signIn;