document.addEventListener('DOMContentLoaded', function(){
    if (document.querySelector('#user_id').innerHTML !== "not_signed_in"){
        document.querySelector('#postbutton').addEventListener('click', addpost);
    }
    //document.querySelector('#postbutton').addEventListener('click', addpost)
    loadposts();
})

function addpost(){
    //const csrftoken = Cookies.get('csrftoken');
    //console.log('calling addpost');
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

//var cancelled = false;
function loadposts(pagination=1){
    clear();
    document.querySelector('#posts').innerHTML = '';
    //let username = '';
    //let myresult = [];
    fetch('/posts?page='+pagination)
    .then((response)=>response.json())
    //.then((data)=>JSON.parse(data))
    .then((myresult)=>{
        let notdoneyet = true;
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
                postdiv.innerHTML = `<div class="card-body ms-2"><h5 class="ms-2"><a href="/profile/${myresult[i]["user"]}">>${myresult[i].user}</a></h5>${myresult[i].text}<hr><p style="color: rgb(211, 211, 211)">${myresult[i].timestamp}</p></div>`;
                postdiv.classList.add('card');
                postdiv.classList.add('ms-2');
                document.querySelector('#posts').append(postdiv);
                //if (document.querySelector('#user_id').innerHTML !== "not_signed_in"){
                    const likebtn = document.createElement('i');
                //}
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
                        if (document.querySelector('#user_id').innerHTML !== "not_signed_in"){
                            likebtn.className = "ms-4 bi bi-heart-fill"; 
                        }
                        //postdiv.append(likes);
                        //postdiv.append(likebtn);
                    }
                    else {
                        if (document.querySelector('#user_id').innerHTML !== "not_signed_in"){
                            likebtn.className = "bi bi-heart ms-4";
                        }
                        //postdiv.append(likes);
                        //postdiv.append(likebtn);
                    }
                });
                    if (document.querySelector('#user_id').innerHTML !== "not_signed_in"){
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
                        })
                    }
                    //postdiv.append(likebtn);
                    //postdiv.append(likes);
                //});
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
                        postdiv.innerHTML = `<div class="card-body ms-2"><h5 class="ms-2">${myresult[i].user}</h5><textarea class="form-control" id=text${myresult[i]["id"]}>${myresult[i]["text"]}</textarea><button class="btn btn-primary" id="updatepostsubmit${myresult[i]["id"]}">Save</button><button id="cancelupdate${myresult[i]["id"]}" class="btn btn-primary">Cancel</button><hr><p style="color: rgb(211, 211, 211)">${myresult[i].timestamp}</p></div>`;
                        document.querySelector(`#updatepostsubmit${myresult[i]["id"]}`).addEventListener('click', ()=>{
                            console.log('saving post');
                            updatetext = document.querySelector('#text'+myresult[i]["id"]).value;
                            fetch('/post/'+myresult[i]["id"], {
                                method: 'PUT',
                                body: JSON.stringify({
                                    text: updatetext
                                })
                            }).then((result)=>result.json())
                            .then((result)=>console.log(result))
                            .then(()=>{
                                loadposts();
                                //postdiv.innerHTML = `<div class="card-body ms-2"><h5 class="ms-2">${myresult[i].user}</h5>${updatetext}<hr><p style="color: rgb(211, 211, 211)">${myresult[i].timestamp}</p></div>`;
                            });
                        });
                        document.querySelector('#cancelupdate'+myresult[i]["id"]).addEventListener('click', ()=>{
                            loadposts();
                            //postdiv.innerHTML = `<div class="card-body ms-2"><h5 class="ms-2">${myresult[i].user}</h5>${myresult[i]["text"]}<hr><p style="color: rgb(211, 211, 211)">${myresult[i].timestamp}</p></div>`;
                        });
                    })
                    postdiv.append(editbutton);
                }
                likes.className = "ms-3"
                postdiv.append(likebtn);
                postdiv.append(likes);

                //console.log("outside fetch");
                fetch('/paginationpages').then(result=>result.json()).then((result)=>{
                    pages = result["pages"];
                }).then(()=>{
                
                //console.log("inside fetch");
                if ((i == 9) || ((pagination == pages) && (notdoneyet))){
                    document.querySelector('#pagination').innerHTML = '';
                    notdoneyet = false;
                    console.log(`${pagination}`);
                    const paginationlist = document.createElement('ul');
                    paginationlist.className = "ms-4 pagination";
                    if (pagination !== 1){
                        const previousbtn = document.createElement('li');
                        previousbtn.className = "page-item";
                        previousbtn.innerHTML = `<a class=\"page-link\" onclick=loadposts(${pagination-1})>Previous</a>`;
                        paginationlist.append(previousbtn);
                    }
                    let paginationnumber = 0;
                    fetch("/paginationpages")
                    .then((result)=>result.json())
                    .then((result)=>{
                        for (let j = 0; j < result["pages"]; j++){
                            paginationnumber = j+1;
                            const paginationitem = document.createElement('li');
                            paginationitem.innerHTML = `<a class=\"page-link\" onclick=loadposts(${paginationnumber})>${paginationnumber}</a>`;
                            paginationitem.className = "page-item";
                            if (parseInt(paginationnumber) == parseInt(pagination)){
                                paginationitem.className = "page-item active";
                            } 
                            paginationlist.append(paginationitem);

                            //paginationitem.onclick = ()=>loadposts(paginationnumber);
                            //paginationitem.onclick = function() {
                            //    cancelled = true;
                            //}
                            //paginationitem.onclick = clear();
                            //paginationitem.onclick = loadposts(paginationnumber);
                            
                        }
                        if (pagination !== paginationnumber){
                            const nextbtn = document.createElement('li');
                            nextbtn.className = "page-item";
                            nextbtn.innerHTML = `<a class=\"page-link\" onclick=loadposts(${pagination+1})>Next</a>`;
                            paginationlist.append(nextbtn);
                        }
                        document.querySelector('#pagination').append(paginationlist);
                    })

                }});

           
            //});
        };
    });
}

function clear(){
    document.querySelector('#posts').innerHTML = '';
}