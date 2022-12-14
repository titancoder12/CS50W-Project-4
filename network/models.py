from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    num_followers = models.IntegerField(default=0)
    num_following = models.IntegerField(default=0)

class Follow(models.Model):
    status = models.BooleanField(default=True)
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")
    def isvalidfollow(self):
        if self.follower == self.following:
            return False
        else:
            return True

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "text": self.text,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes,
            "user_id": self.user.id
        }

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="userlikerelationship")
    post = models.ForeignKey(Post, on_delete=models.PROTECT, related_name="userlikerelationship")