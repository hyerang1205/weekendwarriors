function signUp() {
    let email = document.getElementById("upEmail").value;
    let pw = document.getElementById("upPassword").value;
    let cfpw = document.getElementById("upPasswordConfirm").value;
    let userName = document.getElementById("upName").value;


    if (email && pw && cfpw && userName) {
        if (!isBcitEmail(email)) {
            // Please use the BCIT email (my.bcit.ca).
        } else if (pw != cfpw) {
            // The password does not match.
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, pw).catch(function (error) {
                var errorMessage = error.message;
            });
            // Redirect to main.html.
            document.write("Thanks");
        }
    } else {
        // Please fill in the blanks.
    }
}

function login() {
    let email = document.getElementById("emailForSignIn").value;
    let pw = document.getElementById("pwdForSignIn").value;
    if (email && pw) {
        firebase.auth().signInWithEmailAndPassword(email, pw).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    }
}
function isBcitEmail(email) {
    let re = /\w+[@]my[.]bcit[.]ca/;

    if (re.exec(email) != null) {
        return true;
    } else {
        return false;
    }
}

document.getElementById("signUpButton").onclick = signUp;
document.getElementById("signInButton").onclick = login;