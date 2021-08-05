WEB APPLICATION - CITIZEN SCIENCE

You can run the web application by typing the command 'python main.py' on the terminal

* 'index.html' contains the page structure and HTML elements
* 'main.js' handles main functions when the application loads, as well as changes in the page when hash location changes
* 'model.js' conatins methods for fetching data from the API server
* 'util.js' contains the method 'split_hash'  

When the page first loads, the Model data (users and observations) is updated, 
displaying both recent observations and a user leaderboard.

Main page view contains links to users list, observations list and submission form.
These links result to url hash changes which triggers a change to the displayed information on the page
* "Home" link - displays main page with most recent observations and a top ten users leaderboard
* "Users" link - displays a page that contains a list of users (each user is a clickable link that leads to user profiles) 
* "Observations" link - displays a page that contains a list of observations (each observation is a clickable link that leads to individual observations view)
* "Submit an Observation" link - displays a page that contains a submission form

The 'cypress' folder contains tests which you can run with Cypress(https://cypress.io) application

