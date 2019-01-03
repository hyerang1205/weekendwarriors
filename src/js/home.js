$('#datepicker').datepicker({
    uiLibrary: 'bootstrap4'
});

firebase.auth().onAuthStateChanged(function(user) {
    console.log("USER UID: " + user.uid)
    console.log("USER DISPLAY NAME: " + user.displayName)
    firebase.database().ref("users/" + user.uid).update({
        "name": user.displayName,
        "email": user.email
    });
});

function addPost() {
    let postName = document.getElementById('post-name').value;
    let postDescr = document.getElementById('post-description').value;
    let slackChannelName = document.getElementById('channel-name').value;
    let userId = "testy";
    var postRef = firebase.database().ref("posts/");
    postRef.child(postName).set({
        channelName: slackChannelName,
        name: postName,
        description: postDescr,
        users: userId
    });
}
//document.getElementById('createPost').onclick = addPost;
function populatePosts() {
    var postData = firebase.database().ref('posts').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var postName = childSnapshot.child('name').val();
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

            signUp.addEventListener("click", () => {
                let userId = 'hello';
                let postRef = firebase.database().ref('posts');
                postRef.child(postName).child('users').push(userId);
            });

            signUp.addEventListener("click", () => {
                
            });

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

document.onload = populatePosts();
