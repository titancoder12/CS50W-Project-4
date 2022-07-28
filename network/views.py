from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
import json

from .models import User, Follow, Post


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


def newpost(request):
    # Turn request into a readable dictionary object
    request_json = json.loads(request)

    # Check if request method is POST
    if request.method == "POST":
        # Check if text is provided in request 
        if not request_json.has_key("text"):
            return json.dumps({"message": "Text not provided"})

        # Check if all keys in request are valid
        if not (list(request_json.keys()) == ["text"]):
            return json.dumps({"message": "Unknown key provided"})

        # Create post
        post = Post(user=User(request.user), text=request_json["text"])

        # Add post
        post.save()

        # Return success message
        return json.dumps({"message": "New post added successfully"})

    # Return error message if request method is not POST
    return json.dumps({"message": "POST requests only"})

def updatepost(request, id):
    # Turn request into a readable dictionary object
    request_json = json.loads(request)

    # Get post
    post = post.objects.get(id=Post(id))
    if post 
 

