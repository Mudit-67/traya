access environment variables from .env file
create super user api '/api/super' is a public api(for backend) used to create admin user with role "ADMIN".
users can register themselves with '/api/register' api
users can login with '/api/login' api
when registering a new user, the password is sent to the user's mail in case user forgets the password.
Only admin user can view other user profiles using '/api/allUsers' to view all users and '/api/user/{user_id}' to view single user.
Run command 'npm start' to run the server on port localhost:3000
