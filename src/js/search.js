function getAllPosts() {
    let ref = firebase.database().ref("posts");
    ref.on("child_added", function (snapshot) {
        console.log(snapshot.val().channelName);
    });
}

function searchByChannelName() {
    channelName = document.getElementById("searchField").value;
    let ref = firebase.database().ref("posts");
    ref.on("child_added", function (snapshot) {
        tempChannelName = snapshot.val().channelName;
        if (tempChannelName.search(channelName) > -1) {
            console.log(tempChannelName);
        }
    });
}

function searchByName(name) {
    let ref = firebase.database().ref("posts");
    ref.on("child_added", function (snapshot) {
        tempName = snapshot.val().name;
        if (tempName.search(name) > -1) {
            console.log(tempName);
        }
    });
}

document.getElementById("searchButton").onclick = searchByChannelName;
