from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.urls import reverse
import json
from django.core.paginator import Paginator

from .models import User, Follow, Post, Like


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def posts(request):
    # Get all recent posts
    posts = Post.objects.all().order_by('-id')
    #print("\n" + str([post for post in posts]) + "\n")
    page = request.GET.get('page')
    response = []
    for post in posts:
        serializedpost = post.serialize()
        response.append(serializedpost)
    
    paginator = Paginator(response, 10)
    print(paginator.count)
    print(paginator.num_pages)
    # Return all posts
    print(paginator.page(int(page)).object_list)
    return JsonResponse(paginator.page(int(page)).object_list, safe=False)

def user(request, id):
    user = User.objects.get(id=id)
    username = user.username
    return JsonResponse({"username": username}, safe=True)
    
def pages(request):
    posts = Post.objects.all().order_by('-id').values()
    paginator = Paginator(posts, 10)
    pages = paginator.num_pages
    return JsonResponse({"pages": pages}, safe=True)

    

@csrf_exempt
def newpost(request):
    #print(json.loads(request.body))
    # Turn request into a readable dictionary object
    request_json = json.loads(request.body)
    # Check if request method is POST
    if request.method == "POST":
        # Check if text is provided in request 
        #if not ("text" in list(request_json.keys())):
        #    return json.dumps({"message": "Text not provided"})

        # Check if all keys in request are valid
        #if not (list(request_json.keys()) == ["text"]):
        #ge    return json.dumps({"message": "Unknown key provided"})

        # Create post
        post = Post(user=User(request.user.id), text=request_json.get("text", ""))

        # Add post
        post.save()

        # Return success message
        return JsonResponse(json.dumps({"message": "New post added successfully"}), safe=False)

    # Return error message if request method is not POST
    return json.dumps({"message": "POST requests only"})

@csrf_exempt
def updatepost(request, id):
    # Turn request into a readable dictionary object
    request_json = json.loads(request.body)

    # Check if post id is valid
    # if id > Post.objects.last().id:
    #     # Return error message
    #     return json.dumps({"message": f"Post with id of {id} does not exist"})

    # # Check that there are more than 0 arguments provided
    # elif len(list(request_json.keys())) == 0:
    #     # Return error message
    #     return json.dumps({"message": "No arguments provided in PUT request"})

    # # Check that there are less than two arguments provided
    # elif len(list(request_json.keys())) > 2:
    #     # Return error message
    #     return json.dumps({"message": "Unrecognized argument provided in PUT request"})
    
    # Check to see if request method is PUT
    if request.method == "PUT":
        #print("update post" + request_json)
        # Get post from database
        post = Post.objects.get(id=id)

        # Initialize variable args recieved, which will be used for checking later on
        argsrecieved = 0

        # Check to see if likes is in the PUT request
        if "addlikes" in list(request_json.keys()):
            #print(post.id)
            like = Like(user=User(request.user.id), post=Post(post.id))
            #print("adding " + like)
            like.save()

            # Update the post likes
            post.likes = post.likes + 1

            # Save the post
            post.save()

            # Add 1 to args recieved for checking later
            argsrecieved += 1

        if "removelikes" in list(request_json.keys()):
            like = Like.objects.get(post=Post(id), user=User(request.user.id))
            #print("deleting " + like)
            like.delete()

            # Update the post likes
            post.likes = post.likes - 1

            # Save the post
            post.save()

            # Add 1 to args recieved for checking later
            argsrecieved += 1
            

        # Check to see if text is in the PUT request
        if "text" in list(request_json.keys()):
            # Update the post text
            print(request_json["text"])
            post.text = request_json["text"]

            # Save the post
            post.save()

            # Add 1 to args recieved for checking later
            argsrecieved += 1

        # Check to see if there are more than 0 args
        if argsrecieved <= 0:
            # Return error message
            return json.dumps({"message": "Unrecognized argument provided in PUT request"})

        # Return success message
        return JsonResponse(json.dumps({"message": "Post updated successfully"}), safe=False)
    else:
        # Return error message
        return json.dumps({"message": "PUT requests only"})
    
@csrf_exempt
def follow(request, user_id):
    # Turn request into a readable dictionary object
    #request_json = json.loads(request.body)
    if request.method == "GET":
        print(user_id)
        if user_id == None:
            return JsonResponse(json.dumps({"message": "Missing argument 'user_id' in GET request"}), safe=False)
        follows = Follow.objects.filter(follower=User(request.user.id), following=User(user_id)).count()
        if follows != 0:
            print('true')
            return JsonResponse(json.dumps({'following': 'true'}), safe=False)
        else:
            print('false')
            return JsonResponse(json.dumps({'following': 'false'}), safe=False)
    # Check if request method is post
    elif request.method == "POST":
        print('follow')
        following_user = User.objects.get(id=int(user_id))
        follower_user = User.objects.get(id=int(request.user.id))
        # Create the new follow
        follow = Follow(follower=User(request.user.id), following=User(user_id))
        following_user.num_followers = int(following_user.num_followers) + 1
        follower_user.num_following = int(following_user.num_following) + 1
        # Save the follow
        follow.save()

        # Return success message
        return JsonResponse(json.dumps({"message": "Successfully created new follow"}), safe=False)

    elif request.method == "PUT":
        print('unfollow')
        # Get the follow
        follow = Follow.objects.get(follower=User(request.user.id), following=user_id)
        following_user = User.objects.get(id=int(user_id))
        follower_user = User.objects.get(id=int(request.user.id))
        following_user.num_followers = int(following_user.num_followers) - 1
        follower_user.num_following = int(following_user.num_following) - 1
        # Delete the follow
        follow.delete()

        # Save the follow
        # follow.save()

        # Return success message
        return JsonResponse(json.dumps({"message": "Successfully updated follow"}), safe=False)

def like(request, id):
    like = Like.objects.filter(user=User(request.user.id), post=Post(id)).count()
    #print(Like.objects.filter(user=User(request.user.id), post=Post(id)))
    #print(like)
    if like == 0:
        #print(json.dumps({"liked": "false"}))
        return JsonResponse(json.dumps({"liked": "false"}), safe=False)
    else:
        #print(json.dumps({"liked": "true"}))
        return JsonResponse(json.dumps({"liked": "true"}), safe=False)

def profileAPI(request, user_id):
    # Get all recent posts
    posts = Post.objects.filter(user=User(user_id)).order_by('-id')
    #print("\n" + str([post for post in posts]) + "\n")
    page = request.GET.get('page')
    response = []
    for post in posts:
        serializedpost = post.serialize()
        response.append(serializedpost)
    
    paginator = Paginator(response, 10)
    #print(paginator.count)
    # Return all posts
    print(paginator.page(int(page)).object_list)
    return JsonResponse(paginator.page(int(page)).object_list, safe=False)

def profilepages(request, user_id):
    posts = Post.objects.filter(user=User(user_id)).order_by('-id').values()
    paginator = Paginator(posts, 10)
    pages = paginator.num_pages
    return JsonResponse({"pages": pages}, safe=True)

def profile(request, user_id):
    user = User.objects.get(id=user_id)
    print(user)
    return render(request, 'network/profile.html', {"num_followers": user.num_followers,
                                                    "num_following": user.num_following,
                                                    "username": user.username,
                                                    "user_id": user.id})