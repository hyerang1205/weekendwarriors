function addPost() {
    let postName = document.getElementById('post-name').value;
    let postDescr = document.getElementById('post-description').value;
    var postRef = firebase.database.ref("posts/");

    postRef.update({
        [postName]: {
            name: postName,
            description: postDescr,
            messages: {
                fakeId: {
                    name: 'Weekend Warrior Admin',
                    message: 'Welcome to the chat room for ' + postName
                }
            },
            tag: null,
            users: null,
        }
    })
}