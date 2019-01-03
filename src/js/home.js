$('#datepicker').datepicker({
    uiLibrary: 'bootstrap4'
});

// $('#myModal').modal('show');
//
//    $('#myBtn').on('click', function(){
//      $('#myModal').modal('show');
//    });

function addPost() {
    let postName = document.getElementById('post-name').value;
    let postDescr = document.getElementById('post-description').value;
    let postCate = document.getElementById('post-category').value;
    let postDate = document.getElementById('datepicker').value;
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
        category: postCate,
        date: postDate,
        // users: userId,
        messages: {
            fakeId: {
                name: 'Weekend Warrior Admin',
                message: 'Welcome to the chat room for ' + postName
            }
        }
    };
    var key = postRef.child('posts').push().key;
    let updates = {};
    updates['/posts/' + key] = postData;

    firebase.database().ref().update(updates).then(() => {
        signUp(postRef.child(key).child('users'), userId);
        document.location.reload(true);
        // switchButtons(key);
    });

    // $('#createEvent').modal('hide');
}

function switchButtons(grossKey) {
    const parentDiv = document.getElementById(grossKey).getElementsByClassName("card-body")[0];
    const button = parentDiv.getElementsByTagName("button")[0];

    parentDiv.removeChild(button);

    const chatButton = document.createElement("button");
    chatButton.innerHTML = 'Chat'
    chatButton.setAttribute("type", "button");
    chatButton.setAttribute("class", "btn btn-primary rightFloat");
    //chatButton.setAttribute("data-toggle", "modal");
    chatButton.setAttribute("data-target", "chat-modal");
    chatButton.addEventListener("click", () => {
        $('#chat-modal').modal('show');
        populateChatModal(grossKey);
    });
    parentDiv.appendChild(chatButton);
}

function signUp(postRef, userId) {
    console.log(postRef);
    postRef.child(userId).set(true);
}



//document.getElementById('createPost').onclick = addPost;
function populatePosts(_postName = "", _category = "") {
    removePostsFromBoard();
    console.log("_postName: ", _postName);
    console.log("_category: ", _category);
    var postData = firebase.database().ref('posts').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var postName = childSnapshot.child('name').val();
            var category = childSnapshot.child('category').val();
            if (_postName !== "") {
                if (postName.search(_postName) < -0) {
                    return;
                }
            }
            if (_category !== "") {
                if (category.search(_category) < 0) {
                    return;
                }
            }
            var grossKey = childSnapshot.key;
            var description = childSnapshot.child('description').val();
            var users = childSnapshot.child('users').val();
            var date = childSnapshot.child('date').val();
            console.log(postName);
            console.log(description);
            console.log(users);
            let newDiv = document.createElement('div');
            newDiv.setAttribute("class", "card");
            newDiv.id = grossKey;
            let cardDiv = document.createElement('div');
            cardDiv.setAttribute("class", "card-body");
            let title = document.createElement('h5');
            title.setAttribute("class", "card-title");
            title.innerHTML = postName;
            let postDescription = document.createElement('p');
            postDescription.setAttribute("class", "card-text");
            postDescription.innerHTML = description;

            let postDate = document.createElement('small');
            postDate.setAttribute("class", "text-muted");
            postDate.innerHTML = date;


            let postCate = document.createElement('span');
            postCate.setAttribute("class", "text-muted");
            postCate.innerHTML = category;

            let signUpButton = document.createElement('button');
            signUpButton.setAttribute("type", "button");
            signUpButton.setAttribute("class", "btn btn-primary rightFloat");
            signUpButton.innerHTML = "Join";
            signUpButton.id = 'signUpButton';
            signUpButton.onclick = function () {
                let userId = firebase.auth().currentUser.uid;
                let postRef = firebase.database().ref('posts');
                setTimeout(function () {
                    if (userId === "") {
                        // Login required
                        alert("Please log in.");
                        window.location.assign("././index.html");
                    } else {
                        signUp(postRef.child(grossKey).child('users'), userId);
                        switchButtons(grossKey);
                    }
                }, 300);
            }

            cardDiv.appendChild(title);
            cardDiv.appendChild(postCate);
            cardDiv.appendChild(postDescription);
            cardDiv.appendChild(postDate);
            cardDiv.appendChild(signUpButton);
            newDiv.appendChild(cardDiv)
            document.getElementById('posts').appendChild(newDiv);

            // console.log(`post ${grossKey} has users ${users.toString()}`);
            for (let key in users) {
                if (users.hasOwnProperty(key)) {
                    console.log("user: " + key);
                    if (firebase.auth().currentUser.uid === key) {
                        switchButtons(grossKey);
                    }
                }
            }
        });
    });
}

function populateChatModal(postId) {
    console.log("populating chat messages for post #" + postId);
    let posts = [];

    firebase.database().ref('posts/' + postId).child('messages').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            const msgObj = {
                author: childSnapshot.child('name').val(),
                content: childSnapshot.child('message').val()
            };
            posts.push(msgObj);
        });
    }).then(() => {
        const chatBody = document.getElementById("chat-body");
        chatBody.innerHTML = "";

        posts.forEach((msg) => {
            const chatMsg = createChatNode(msg.content, msg.author);
            console.log("HTML node for message: " + chatMsg);

            chatBody.appendChild(chatMsg);
        });
    });

    const INPUT = document.getElementById("chat-input");
    const POST_BUTTON = document.getElementById("chat-button");

    POST_BUTTON.addEventListener("click", () => {
        const content = INPUT.value;
        let author;

        firebase.database().ref("/users/" + firebase.auth().currentUser.uid).once("value").then((snap) => {
            author = snap.child("name").val();
            // console.log("author is: " + author);
    
            firebase.database().ref(`posts/${postId}/messages`).push({
                message: content,
                name: author
            });
        });
    });
}

function lookupUserName(userId) {
    let username;
    firebase.database().ref("/users/" + userId).once("value").then((snap) => {
        username = snap.child("name").val();
        return username;
    });
}

function getMessages(postId) {
    let posts = [];

    firebase.database().ref('posts/' + postId).child('messages').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            const msgObj = {
                author: childSnapshot.child('name').val(),
                content: childSnapshot.child('message').val()
            };
            posts.push(msgObj);
        });
    }).then(() => {
        return posts;
    });
}

function createChatNode(content, author) {
    const container = document.createElement("div");
    container.className = "chat-box";

    const text = document.createElement("p");
    text.innerHTML = content;

    const authorName = document.createElement("span");
    authorName.className = "name-left";
    authorName.innerHTML = author;

    container.appendChild(text);
    container.appendChild(authorName);

    return container;
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


firebase.auth().onAuthStateChanged(function (user) {
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

document.getElementById("searchViewAll").onclick = function() {
    populatePosts();
}

document.getElementById("searchEntertainment").onclick = function () {
    populatePosts("", "Entertainment");
}

document.getElementById("searchLearning").onclick = function () {
    populatePosts("", "Learning");
}

document.getElementById("searchOutdoor").onclick = function () {
    populatePosts("", "Outdoor");
}

document.getElementById("searchSports").onclick = function () {
    populatePosts("", "Sports");
}
