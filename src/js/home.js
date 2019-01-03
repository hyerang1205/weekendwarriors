$('#datepicker').datepicker({
    uiLibrary: 'bootstrap4'
});


function addPost() {
    let postName = document.getElementById('post-name').value;
    let postDescr = document.getElementById('post-description').value;
    var userId = firebase.auth().currentUser.uid;
    var postRef = firebase.database().ref("posts/");
    //postRef.child(postName).set({
        //name: postName,
        //description: postDescr,
        //users: userId
    //});
    let postData = {
        name: postName,
        description: postDescr,
        users: userId,
        messages: {
            fakeId: {
                name: 'Weekend Warrior Admin',
                message: 'Welcome to the chat room for ' + postName
            }
        }
    };
    let key = postRef.child('posts').push().key;
    let updates = {};
    updates['/posts/' + key] = postData;

    return firebase.database().ref().update(updates);
}
//document.getElementById('createPost').onclick = addPost;
function populatePosts(_postName="") {
    removePostsFromBoard();
    var postData = firebase.database().ref('posts').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var postName = childSnapshot.child('name').val();
            if (_postName !== "") {
                if (postName.search(_postName) < 0) {
                    return;
                }
            }
            var description = childSnapshot.child('description').val();
            var users = childSnapshot.child('users').val();
            console.log(postName);
            console.log(description);
            console.log(users);
            let newDiv = document.createElement('div');
            newDiv.setAttribute("class", "card");
            newDiv.id = postName;
            let cardDiv = document.createElement('div');
            cardDiv.setAttribute("class", "card-body");
            let title = document.createElement('h5');
            title.setAttribute("class", "card-title");
            title.innerHTML = postName;
            let postDescription = document.createElement('p');
            postDescription.setAttribute("class", "card-text");
            postDescription.innerHTML = description;

            /*let date = document.createElement('p');
            let dateSmall = document.createElement('small');
            dateSmall.setAttribute("class", "text-muted");
            dateSmall.innerHTML = date;
            date.appendChild(dateSmall);*/

            let signUp = document.createElement('button');
            signUp.setAttribute("type", "button");
            signUp.setAttribute("class", "btn btn-primary");
            signUp.innerHTML = "Sign Up";
            signUp.onclick = function () {
                let userId = '';
                let userEmail = '';
                let postRef = firebase.database().ref('posts');
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        var email = user.email;
                        console.log(email);
                        let re = /(\w+)[@]my[.]bcit[.]ca/;
                        let result = re.exec(email)[1];
                        console.log(result);
                        firebase.database().ref("users").on("child_added", function(snapshot) {
                            if (snapshot.key === result) {
                                userEmail = snapshot.key;
                                userId = snapshot.val().name;
                            }
                        });
                    }
                });
                setTimeout(function() {
                    if (userId === "") {
                        // Login required
                        alert("Please log in.")
                    } else {
                        postRef.child(postName).child('users').update({
                            [userId]: userEmail
                        });
                    }
                }, 300);
            }

            cardDiv.appendChild(title);
            cardDiv.appendChild(postDescription);
            //cardDiv.appendChild(date);
            cardDiv.appendChild(signUp);
            newDiv.appendChild(cardDiv)
            document.getElementById('posts').appendChild(newDiv);
        });
    });
}

document.getElementById("signOutButton").addEventListener("click", () => {
    firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.assign("./index.html");
    });
});

function removePostsFromBoard() {
    $(".card").remove();
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var uid = user.uid;
        console.log(email);
    }
});

document.onload = populatePosts();

document.getElementById("searchButton").onclick = function() {
    populatePosts(document.getElementById("searchField").value);
}