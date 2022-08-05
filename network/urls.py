
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
    path("follow/<int:id>", views.follow, name="getfollow"),
    path("follow", views.follow, name="follow"),
    path("user/<int:id>", views.user, name="user"),
    path("like/<int:id>", views.like, name="like"),
    path("paginationpages", views.pages, name="paginationpages")
]
