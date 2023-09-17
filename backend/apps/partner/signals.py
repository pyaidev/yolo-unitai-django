from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Partner, PartnerProfile


@receiver(post_save, sender=Partner)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        PartnerProfile.objects.create(user=instance)


@receiver(post_save, sender=Partner)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()
