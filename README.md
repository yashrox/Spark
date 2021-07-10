Project Description  (PROJECT TEST)

TechSatck -> TypeScript , Node.js (14), Express (4), Mongoose (5), Postman

Basic Auth -> Spark Spark

Script to start server => npm run start  (It will create a build and start the node server)

APIS -> Register , Login , List , Logout.

Data For Regsiter  

                     1) Basic Auth 
                     
                     2) Raw Body  { name , phone_number , email , primary_filed: 1 | 2 , device_type: 1 | 2 | 3 , device_token , gender, country, password}
                     
                     3) POST Request
                     
Data For Login


                      1) Basic Auth
                     
                     2) Raw Body {user , primary_filed: 1 | 2 , password}   
                     
                     3) POST Request


Note -> primary_field = {email: 1 , phone_number = 2} 
        device_type = {   IOS = 1, ANDROID = 2, WEB = 3, } 
