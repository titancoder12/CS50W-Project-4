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
    })//.then((result)=>console.log(result))
    .then(()=>{
        document.querySelector('#posttext').value = '';
        clear();
        document.querySelector('#posts').innerHTML = '';
        loadposts(1);
    });
    //return false;
}

function like(post_id) {
    //console.log("like");
    fetch('/post/'+post_id, {
        method: 'PUT',
        body: JSON.stringify({
            addlikes: 1
        })
    });
}

function unlike(post_id) {
    //console.log("unlike");
    fetch('/post/'+post_id, {
        method: 'PUT',
        body: JSON.stringify({
            removelikes: 1
        })
    });
}

function loadposts(pagination=1){
    //let username = '';
    //let myresult = [];
    fetch('/posts?page='+pagination)
    .then((response)=>response.json())
    //.then((data)=>JSON.parse(data))
    .then((myresult)=>{
        for (let i = 0; i < myresult.length; i++){
            //console.log(i)
            //fetch('/user/'+myresult[i]["user_id"])
            //.then((result)=>result.json())
            //.then((result)=>JSON.parse(result))
            //.then((user_result) => {
            //    username=user_result["username"];
            //    console.log(username);
            //});
                //console.log("***"+i);
                const likes = document.createElement('p');
                likes.style.color = "rgb(128, 128, 128)";
                //console.log(myresult[i]["likes"]);
                likes.innerHTML = `${myresult[i]["likes"]} like(s)`;
                likes.id = myresult[i]["likes"];

                //username = user_result.username;
                const postdiv = document.createElement('div');
                postdiv.innerHTML = `<div class="card-body ms-2"><h5 class="ms-2">${myresult[i].user}</h5>${myresult[i].text}<hr><p style="color: rgb(211, 211, 211)">${myresult[i].timestamp}</p></div>`;
                postdiv.classList.add('card');
                postdiv.classList.add('ms-2');
                document.querySelector('#posts').append(postdiv);
                const likebtn = document.createElement('i');
                //likebtn.setAttribute('nowrap', '');
                //likes.style.display = "inline";
                //postdiv.style.wordBreak = "break-word";
                //postdiv.append(likebtn);
                //likebtn.style.display = "inline-block";
                //likes.style.display = "inline-block";
                fetch('/like/'+myresult[i]["id"])
                .then((result)=>result.json())
                .then((result)=>JSON.parse(result))
                .then((result)=>{
                    //console.log("result:"+result)
                    if (result["liked"] == "true"){
                        likebtn.className = "ms-4 bi bi-heart-fill"; 
                        //postdiv.append(likes);
                        //postdiv.append(likebtn);
                    }
                    else {
                        likebtn.className = "bi bi-heart ms-4";
                        //postdiv.append(likes);
                        //postdiv.append(likebtn);
                    }
                });
                likebtn.addEventListener('click', function() {
                    //console.log("!@#$%^&^%$#$%^&^%$%^&%$%^%$%^%$%^%$%^%$%^%^&^%^&%^%$%^%$^&^%^&^%^&%&^%^&^%^&%&^%^&^%^& Like button clicked")
                    fetch('/like/'+myresult[i]["id"])
                    .then((response)=>response.json())
                    .then((data)=>JSON.parse(data))
                    .then((result)=>{
                        //console.log(result);
                        //console.log("liked is " + String(result['liked']));
                        //console.log("result is: " + typeof(result)); // result is actually a string
                        //console.log(result["liked"] == 'false');
                        if (result["liked"] == "true"){
                            //console.log("unlike")
                            likebtn.className = "bi bi-heart ms-4";
                            unlike(myresult[i]["id"]);
                            likes.innerHTML = `${parseInt(likes.id) - 1} like(s)`;
                            likes.id = parseInt(likes.id) - 1;
                            //postdiv.append(likebtn);
                            //postdiv.append(likes);
                            //postdiv.append(likebtn);
                            //return console.log("added like");
                        }
                        else if (result["liked"] == "false"){
                            //console.log("like")
                            likebtn.className = "ms-4 bi bi-heart-fill"; 
                            like(myresult[i]["id"]);
                            likes.innerHTML = `${parseInt(likes.id) + 1} like(s)`;
                            likes.id = parseInt(likes.id) + 1;
                            //postdiv.append(likebtn);
                            //return console.log("removed like");
                        }
                    });
                    //postdiv.append(likebtn);
                    //postdiv.append(likes);
                });
                //console.log(myresult[i]["user_id"]);
                //console.log(document.querySelector('#user_id').innerHTML)
                if (myresult[i]["user_id"] == parseInt(document.querySelector('#user_id').innerHTML)){
                    const editbutton = document.createElement('button');
                    editbutton.className = "ms-4 me-auto btn btn-primary";
                    editbutton.innerHTML="Edit";
                    editbutton.id = "editbtn";
                    editbutton.style.display = "inline-block";
                    //editbutton.style.textAlign = "left";
                    //editbutton.style.width = "20px";
                    editbutton.addEventListener('click', ()=>{
                        
                    })
                    postdiv.append(editbutton);
                }
                likes.className = "ms-3"
                postdiv.append(likebtn);
                postdiv.append(likes);
                if (i == 9){
                    const paginationlist = document.createElement('ul');
                    paginationlist.className = "ms-4 pagination";
                    let paginationnumber = 1;
                    fetch("/paginationpages")
                    .then((result)=>result.json())
                    .then((result)=>{
                        for (let j = 0; j < result["pages"]; j++){
                            const paginationitem = document.createElement('li');
                            paginationitem.innerHTML = `<a class=\"page-link\" href=\"">${paginationnumber}</a>`;
                            paginationitem.className = "page-item";
                            console.log(`${paginationnumber} = ${pagination}`)
                            if (parseInt(paginationnumber) == parseInt(pagination)){
                                paginationitem.className = "page-item active"
                            } 
                            paginationlist.append(paginationitem);
                            paginationnumber += 1;
                        }
                        document.querySelector('#posts').append(paginationlist);
                    })

                }

           
            //});
        };
    });
}

function clear(){
    document.querySelector('#posts').value = '';
}