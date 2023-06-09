Meal-Helper
Live Version: https://meal-helper-heroku.herokuapp.com/

Setup: requires .env file containing PORT and mongodb DB_STRING variables, note recipie information is contained inside of my databse and will have to be created for the application to show recipies locally.

Once downloaded and env variables in place install dependancies and start the applicaiton with 'npm run dev'

About: Meal helper is a Hello Fresh/Gusto clone aimed to allow you to store your favourite recipes from these services and easily create shopping lists for all the required items, and provide easy access to the cooking instructions. The project was created with EJS CSS JS with an express backend hooked up to a mongodb for persistant storeage. 

While there is scope to implement further features and improve upon the current state of the web app for the time being this project is on hold.

Future goals

Add new ingredients into app, currently this must be done manually - []<br>
Add an export to plain text/email/other todo app for shopping lists - []<br>
Fix DB structure to include an ingredients table, this would simplify some of the work arounds that arose later in the project - []<br>
Get price data from current supermarket prices and give an indication of cost per meal - []<br>
Add the ability to search for meal types e.g. pasta,indian,chicken,vegitarian - []<br>
Pagenation when loading all recipies in - []<br>
Tidy up css - []<br>
accessibility/html tags improvements - []<br>
add mobile versions of larger images - []<br>
pictures for the cooking steps - []<br>
scale recipie ammounts based on how many people user wishes to feed, currently all recipes are for two people - []<br>
email verification when signing up - []<br>
recapatcha when creating meals to prevent bot spam - []<br>
forgotton password functionality - []<br>
my account page for users personal info/preferences/password change - []<br>
