document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#postbutton').addEventListener('click', addpost)
    loadposts();
})

function addpost(){
    //const csrftoken = Cookies.get('csrftoken');
    console.log('calling addpost');
    text = document.querySelector('#posttext').value;
    fetch('/post', {
        method: 'POST',
        //headers: {'X-CSRFToken': csrftoken},
        //mode: 'same-origin',
        body: JSON.stringify({
            text: text
        })
    }).then((result)=>console.log(result))
    .then(()=>{
        document.querySelector('#posttext').value = '';
        clear();
        loadposts();
    });
    return false;
}

function like(post_id) {
    fetch('/post/'+post_id, {
        method: 'PUT',
        body: JSON.stringify({
            addlikes: 1
        })
    });
}

function loadposts(){
    let username = '';
    let myresult = [];
    fetch('/posts')
    .then((result)=>result.json())
    .then((result)=>{
        myresult = result;
    })
    .then(()=>{
        for (let i = 0; i < myresult.length; i++){
            fetch('/user/'+myresult[i]["user_id"])
            .then((result)=>result.json())
            .then((result) => {
                username = result.username;
                const postdiv = document.createElement('div');
                postdiv.innerHTML = `<div class="card-body ms-2"><h5 class="ms-2">${username}</h5>${myresult[i].text}<hr><p style="color: rgb(211, 211, 211)">${myresult[i].timestamp}</p></div>`;
                postdiv.classList.add('card');
                postdiv.classList.add('ms-2');
                document.querySelector('#posts').append(postdiv);

                const likebtn = document.createElement('i')
                likebtn.className = "bi bi-heart ms-4";
                likebtn.addEventListener('click', function() {
                    likebtn.className = "ms-4 bi bi-heart-fill"; 
                    like(myresult[i]["id"]);
                });
                postdiv.append(likebtn);
            })
        };
    });
}

function clear(){
    document.querySelector('#posts').value = '';
}