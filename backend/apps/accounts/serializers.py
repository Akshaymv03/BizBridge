from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'account_type', 'phone', 'avatar', 
                  'is_verified', 'company_name', 'tax_id', 'first_name', 'last_name']
        read_only_fields = ['id', 'is_verified']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'account_type', 'company_name']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            account_type=validated_data.get('account_type', 'BUYER'),
            company_name=validated_data.get('company_name', '')
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    data['user'] = user
                else:
                    raise serializers.ValidationError('Invalid email or password')
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid email or password')
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return data