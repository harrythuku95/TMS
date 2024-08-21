# 1. Recreate the migrations file manually
# 2. Go on each model 1 by 1 and create the createTable logic
# 3. Create the addColumns section items 1 by 1
## A concern on this area
- Why are the columns of the user table the only ones being created?
# 4. Create the removeColumns section items 1 by 1
# 5. Create the dropTable section items 1 by 1
# 6. Make sure I get the order correctly


Original password: htogrd08
Hashed password: $2b$12$SCJGDTmjUtE8QfftxjF4w.8XKcj3Rf7/2f0AcjrySGJtFTBBxrx.6




## To be added on github docs:
```
# Drop and recreate the database
dropdb -h localhost -p 5432 -U admin db_tms
createdb -h localhost -p 5432 -U admin db_tms

# Run migrations
yarn sequelize db:migrate

# Seed the roles and permissions first
yarn sequelize db:seed --seed 20200430130760-user-roles.js

# Seed the users
yarn sequelize db:seed --seed 20200430130759-admin-user.js

# Start the application
yarn start
```
## Cleaning technique
Inside the app, there is "Routes","Models","Api" which are symetrical
- First objective is to go through each file in this symetry in order to make sure that everything works fine.
- Try to rerun the application inorder to make sure that nothing breaks after the symetry changes. 


## Improvement proposals and code checkup
- Make sure that the user model, agent model, permission  and role model have a perfect relationship structure and everything fits in well from the api to the services and to the routes
- Create a feature whereby the Admin user can assign different roles and permissions to other users(User Management Page. Only accessible by the admin ) - Create a feature whereby before a user is created, the system first checks if there is an admin user on the database if not then the default role for that user is admin(this feature should respect the relationship structure of the user model permission, role and agent)
- Create a customer model and a script that can autofill this data
- The default status of a user when created is an agent (an agent is supposed to handle tickets, just as chat GPT suggested)
### Permission Scopes
- Delete Ticket(Admin) - There will be an approval system for deleting the Tickets
- Create Ticket (Admin/Agent)
- View Ticket(Admin/Agent/User)
- Update Ticket(Admin/Agent) - Email notification will be sent to Admin/Agent to notify them for the New Updates
- Close Ticket  -There will be an approval system for closing the Tickets

#### ticket update process
1. there is an Update Ticket button which is only vissible to the Admin/Agent users from the frontend which will lead to a TicketUpdatePage whereby the user can get access to the update form and update the necessary fields
2. after the user successfully updates the ticket an email notification will be sent to the other admins and agents

#### ticket closing process
1. - there will be a close ticket button which will only be vissible to the Admin/Agent users from the frontend which will lead to a SendCloseRequestPage, whereby the user can view the the close request of that ticket at the top of the page and more information about that ticket as well as other tickets with close requests. 
- One ticket can only have one close request at a time
- Before a ticket is closed, a close request has to be created therefore close requests might be their own models in the db and they will have a relationship to the tickets
2. 0n the SendCloseRequestPage the agent or admin will be able to approve the close requests of other tickets, there will be an expansion view whereby the agent or admin can expand the view of a list item and view more detils of the ticket with the close request and they can also be able to view extra fields like the files. there will also be an option that directs you back to the ticket details page. 
- it will be possible to view wether a ticket has a close request from the ticket details page(this will likely be a materialUI label that shows the users this)

#### ticket close request data models
- id 
- ticket
- timestamp
- user as createdby
- approved(boolean field) - two users other than the creator must approve for the ticket to be closed
- number_of_approval_requests - whenever an admin or agent clicks the approve request 
- reason (Ticket Closed - Tic)


###### I think I should rethink this deletion request featre and only create a ticket closing approval process - then a script running on a cron job that scans the whole db for closed tickets and deletes them if at all there is a need for deletion



