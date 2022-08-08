
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API routes
    path("post", views.newpost, name="newpost"),
    path("post/<int:id>", views.updatepost, name="updatepost"),
    path("posts", views.posts, name="posts"),
    path("follow/<int:user_id>", views.follow, name="follow"),
    path("user/<int:id>", views.user, name="user"),
    path("like/<int:id>", views.like, name="like"),
    path("paginationpages", views.pages, name="paginationpages"),
    path("profileposts/<int:user_id>", views.profileAPI, name="profileAPI"),
    path("profilepages/<int:user_id>", views.profilepages, name="profilepages"),
    path("profile/<int:user_id>", views.profile, name="profile")
]
