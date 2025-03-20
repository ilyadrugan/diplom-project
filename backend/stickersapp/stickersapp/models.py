from django.db import models

class Types(models.Model):
    type_name = models.CharField(max_length=255, verbose_name="Type name")

    def __str__(self):
        return self.type_name

    class Meta:
        db_table = 'tbl_types'

class Photos(models.Model):
    photo_url = models.ImageField(upload_to='photos/')
    coord_long = models.FloatField(verbose_name="Longitude")
    coord_lat = models.FloatField(verbose_name="Latitude")
    request_id = models.IntegerField(verbose_name="Request_ID")
    address = models.CharField(max_length=255, verbose_name="Address",null=True)
    class Meta:
        db_table = 'tbl_photos'

class Requests(models.Model):
    type_id = models.IntegerField(verbose_name="Type_ID")
    user_login = models.IntegerField(verbose_name="User_Login")
    comment = models.CharField(max_length=255, verbose_name="Comment",null=True)
    #time_create = models.CharField(max_length=255, verbose_name="Time created", null=True)
    time_create = models.DateTimeField(auto_now_add=True, verbose_name="Time created")
    def __str__(self):
        return str(self.id)
    class Meta:
        db_table = 'tbl_requests'

class Users(models.Model):
    statuses = (('W','worker'),('M','master'))
    login = models.IntegerField(verbose_name="Login")
    email = models.CharField(max_length=255, verbose_name="E-mail")
    password = models.CharField(max_length=255, verbose_name="Password")
    user_status = models.CharField(max_length=255, choices=statuses, default="W",null=True)
    def __str__(self):
        return str(self.id)
    class Meta:
        db_table = 'tbl_users'