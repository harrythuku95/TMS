# 1. Recreate the migrations file manually
# 2. Go on each model 1 by 1 and create the createTable logic
# 3. Create the addColumns section items 1 by 1
## A concern on this area
- Why are the columns of the user table the only ones being created?
# 4. Create the removeColumns section items 1 by 1
# 5. Create the dropTable section items 1 by 1
# 6. Make sure I get the order correctly




###
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: Sequelize.TEXT,
      },
      lastName: {
        type: Sequelize.TEXT,
      },
      phoneNumber: {
        type: Sequelize.TEXT,
      },
      disabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('Admin', 'Agent', 'User'),
        defaultValue: 'User',
        allowNull: false,
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emailVerificationToken: {
        type: Sequelize.TEXT,
      },
      emailVerificationTokenExpiresAt: {
        type: Sequelize.DATE,
      },
      passwordResetToken: {
        type: Sequelize.TEXT,
      },
      passwordResetTokenExpiresAt: {
        type: Sequelize.DATE,
      },
      provider: {
        type: Sequelize.TEXT,
      },
      importHash: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
####
Original password: htogrd08
Hashed password: $2b$12$SCJGDTmjUtE8QfftxjF4w.8XKcj3Rf7/2f0AcjrySGJtFTBBxrx.6


## Work Plan Testing
- Removing the Asignee field to the Ticket Creation form
- Fixing the Logi Issue(New one)
- Giving the AI New Data to work with



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



"""

Failed to load resource: the server responded with a status of 400 (Bad Request)Understand this error

HomePage.jsx:37 Error fetching stats: AxiosErrorcode: "ERR_BAD_REQUEST"config: {transitional: {…}, adapter: Array(3), transformRequest: Array(1), transformResponse: Array(1), timeout: 0, …}message: "Request failed with status code 400"name: "AxiosError"request: XMLHttpRequest {onreadystatechange: null, readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, …}response: {data: 'Unauthorized', status: 400, statusText: 'Bad Request', headers: AxiosHeaders, config: {…}, …}stack: "AxiosError: Request failed with status code 400\n    at settle (http://localhost:5173/node_modules/.vite/deps/axios.js?v=514403b2:1216:12)\n    at XMLHttpRequest.onloadend (http://localhost:5173/node_modules/.vite/deps/axios.js?v=514403b2:1562:7)\n    at Axios.request (http://localhost:5173/node_modules/.vite/deps/axios.js?v=514403b2:2078:41)\n    at async Promise.all (index 1)\n    at async fetchStats (http://localhost:5173/src/pages/HomePage.jsx:37:50)"[[Prototype]]: Error

overrideMethod @ console.js:288

fetchStats @ HomePage.jsx:37

Show 1 more frame

Show lessUnderstand this error

:8080/api/customers/count:1 

        

        

       Failed to load resource: the server responded with a status of 400 (Bad Request)Understand this error

HomePage.jsx:37 Error fetching stats: AxiosErrorcode: "ERR_BAD_REQUEST"config: {transitional: {…}, adapter: Array(3), transformRequest: Array(1), transformResponse: Array(1), timeout: 0, …}message: "Request failed with status code 400"name: "AxiosError"request: XMLHttpRequest {onreadystatechange: null, readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, …}response: {data: 'Unauthorized', status: 400, statusText: 'Bad Request', headers: AxiosHeaders, config: {…}, …}stack: "AxiosError: Request failed with status code 400\n    at settle (http://localhost:5173/node_modules/.vite/deps/axios.js?v=514403b2:1216:12)\n    at XMLHttpRequest.onloadend (http://localhost:5173/node_modules/.vite/deps/axios.js?v=514403b2:1562:7)\n    at Axios.request (http://localhost:5173/node_modules/.vite/deps/axios.js?v=514403b2:2078:41)\n    at async Promise.all (index 1)\n    at async fetchStats (http://localhost:5173/src/pages/HomePage.jsx:37:50)"[[Prototype]]: Error

"""

The above pasted content is from the browser console when I go to the homepage. I suspect the issue with fetching the stats might be because the database is empty and there are no stats to fetch. So review all the associated code and confirm that the errors are because the database is empty if not, then suggest for me a solution and an update to fix the problem of fetching the stats. 

When I click the tickets button on the sidebar, which is supposed to redirect me to the ticketList page, I don't see any tickets on this page, this could be because there are no tickets in the database yet but I am now getting this output in the browser console

"""

console.js:288 Warning: validateDOMNesting(...): Whitespace text nodes cannot appear as a child of <tr>. Make sure you don't have any extra whitespace between tags on each line of your source code. at tr at http://localhost:5173/node_modules/.vite/deps/chunk-XZYJJ53R.js?v=514403b2:1698:50 at TableRow2 (http://localhost:5173/node_modules/.vite/deps/@mui_material.js?v=514403b2:47513:17) at thead at http://localhost:5173/node_modules/.vite/deps/chunk-XZYJJ53R.js?v=514403b2:1698:50 at TableHead2 (http://localhost:5173/node_modules/.vite/deps/@mui_material.js?v=514403b2:46633:17) at table at http://localhost:5173/node_modules/.vite/deps/chunk-XZYJJ53R.js?v=514403b2:1698:50 at Table2 (http://localhost:5173/node_modules/.vite/deps/@mui_material.js?v=514403b2:46008:17) at div at http://localhost:5173/node_modules/.vite/deps/chunk-XZYJJ53R.js?v=514403b2:1698:50 at Paper2 (http://localhost:5173/node_modules/.vite/deps/@mui_material.js?v=514403b2:2479:17) at div at http://localhost:5173/node_modules/.vite/deps/chunk-XZYJJ53R.js?v=514403b2:1698:50 at Box3 (http://localhost:5173/node_modules/.vite/deps/chunk-PWE7N6AZ.js?v=514403b2:627:19) at div at http://localhost:5173/node_modules/.vite/deps/chunk-XZYJJ53R.js?v=514403b2:1698:50 at Container3 (http://localhost:5173/node_modules/.vite/deps/chunk-PWE7N6AZ.js?v=514403b2:1969:19) at TicketListPage (http://localhost:5173/src/pages/TicketListPage.jsx:36:33) at http://localhost:5173/src/hoc/withAgentProtection.jsx:24:22 at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=514403b2:4022:5) at Routes (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=514403b2:4457:5) at main at div at AuthProvider (http://localhost:5173/src/context/auth.jsx:28:32) at Router (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=514403b2:4400:15) at BrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=514403b2:5146:5) at App at RtlProvider (http://localhost:5173/node_modules/.vite/deps/chunk-PWE7N6AZ.js?v=514403b2:1004:5) at ThemeProvider (http://localhost:5173/node_modules/.vite/deps/chunk-PWE7N6AZ.js?v=514403b2:953:5) at ThemeProvider2 (http://localhost:5173/node_modules/.vite/deps/chunk-PWE7N6AZ.js?v=514403b2:1043:5) at ThemeProvider (http://localhost:5173/node_modules/.vite/deps/chunk-EQDKYOTZ.js?v=514403b2:311:12)

"""

When I click the customers button, I also do not see any data in the page, but it could be because there are no customers recorded in the database

Also the page is blank when I click the Add Customer button and also for the Close Request and The User Management button. I also suspect that this is because the DB is empty. and there is no records but if this is caused by errors or problems in the implementation of the respective functionalities,  review them and suggest for me the solutions that will fix the problems. 

Now When I click the CreateTicket Page button, I get the following errors in the browser console. 

"""

CreateTicketPage.jsx:48 Error fetching labels:

AxiosError {message: 'Request failed with status code 400', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}

fetchLabels@CreateTicketPage.jsx:48await in fetchLabels(anonymous)@CreateTicketPage.jsx:23Show 13 more frames

CreateTicketPage.jsx:28 GET http://localhost:8080/api/customers 400 (Bad Request)

Promise.thenfetchCustomers@CreateTicketPage.jsx:28(anonymous)@CreateTicketPage.jsx:22Show 18 more frames

CreateTicketPage.jsx:35 Error fetching customers:

AxiosError {message: 'Request failed with status code 400', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}

code: "ERR_BAD_REQUEST"

config: {transitional: {…}, adapter: Array(3), transformRequest: Array(1), transformResponse: Array(1), timeout: 0, …}

message: "Request failed with status code 400"

name: "AxiosError"

request: XMLHttpRequest {onreadystatechange: null, readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, …}

response: {data: 'Unauthorized', status: 400, statusText: 'Bad Request', headers: AxiosHeaders, config: {…}, …}

stack: "AxiosError: Request failed with status code 400\n at settle (http://localhost:5173/node_modules/.vite/deps/axios.js?v=514403b2:1216:12)\n at XMLHttpRequest.onloadend (http://localhost:5173/node_modules/.vite/deps/axios.js?v=514403b2:1562:7)\n at Axios.request (http://localhost:5173/node_modules/.vite/deps/axios.js?v=514403b2:2078:41)\n at async fetchCustomers (http://localhost:5173/src/pages/CreateTicketPage.jsx?t=1724842265416:42:24)"

[[Prototype]]: Error

fetchCustomers@CreateTicketPage.jsx:35await in fetchCustomers(anonymous)@CreateTicketPage.jsx:22Show 12 more frames

CreateTicketPage.jsx:41 GET http://localhost:8080/api/ticket_labels 400 (Bad Request)

Promise.thenfetchLabels@CreateTicketPage.jsx:41(anonymous)@CreateTicketPage.jsx:23Show 18 more frames

CreateTicketPage.jsx:48 Error fetching labels:

AxiosError {message: 'Request failed with status code 400', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}

fetchLabels@CreateTicketPage.jsx:48await in fetchLabels(anonymous)@CreateTicketPage.jsx:23Show 12 more frames

"""

Now for the TicketPage, I am able to see the ticket form irregadles of the errors in the browser console unlike the other pages which some are blank, but the TicketCreation Page has its own problems that I think are related to all this other problems from all this other pages that I have shared with you. 

Let me start describing the problems with the CreateTicketPage: