from django.db import models

class Types(models.Model):
    type_name = models.CharField(max_length=255, verbose_name="Type name")

    def __str__(self):
        return self.type_name

    class Meta:
        db_table = 'tbl_types'

class Requests(models.Model):
    STATUS_NEW = 0
    STATUS_DONE = 1
    STATUS_REJECTED = 2

    STATUS_CHOICES = [
        (STATUS_NEW, 'New'),
        (STATUS_DONE, 'Done'),
        (STATUS_REJECTED, 'Rejected'),
    ]
    type = models.ForeignKey('Types', on_delete=models.CASCADE, related_name='requests')
    user_login = models.IntegerField(verbose_name="User_Login")
    comment = models.CharField(max_length=255, verbose_name="Comment",null=True)
    time_create = models.DateTimeField(auto_now_add=True, verbose_name="Time created")
    status = models.IntegerField(choices=STATUS_CHOICES, default=STATUS_NEW, verbose_name="Status")
    def __str__(self):
        return str(self.id)
    class Meta:
        db_table = 'tbl_requests'

class Photos(models.Model):
    request = models.ForeignKey(Requests, on_delete=models.CASCADE, related_name='photos')
    photo_url = models.ImageField(upload_to='photos/')
    coord_long = models.FloatField(verbose_name="Longitude")
    coord_lat = models.FloatField(verbose_name="Latitude")
    # request_id = models.IntegerField(verbose_name="Request_ID")
    address = models.CharField(max_length=255, verbose_name="Address",null=True)

    def __str__(self):
        return f"Photo {self.id} for Request {self.request.id}"
    class Meta:
        db_table = 'tbl_photos'

class Users(models.Model):
    statuses = (('W','worker'),('M','master'))
    login = models.IntegerField(verbose_name="Login")
    email = models.CharField(max_length=255, verbose_name="E-mail")
    password = models.CharField(max_length=255, verbose_name="Password")
    user_status = models.CharField(max_length=255, choices=statuses, default="W",null=True)
    name = models.CharField(max_length=255, default="Name", verbose_name="Name")
    last_name = models.CharField(max_length=255,default="Last Name", verbose_name="Last_name")

    def __str__(self):
        return str(self.id)
    class Meta:
        db_table = 'tbl_users'