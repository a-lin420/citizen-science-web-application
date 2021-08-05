import * as views from './views.js';
import {Model} from './model.js';
import {split_hash} from './util.js';

// mainDisplay - display data in main page
function mainDisplay() {
    let mostRecentObservations = Model.get_recent_observations(10);
    let userLeaderboard = Model.get_top_ten_users();
    
    // display ten most recent observations 
    // display top ten users leaderboard
    views.homePageView("target", mostRecentObservations, "target2", userLeaderboard);
}
// usersListDisplay - display list of users 
function usersListDisplay() {
    let usersList = Model.get_ordered_users();
    views.listUserView("target", usersList);

    let target = document.getElementById("target2");
    target.innerHTML = "";
}
// observationsListDisplay - display list of observations
function observationsListDisplay() {
    let observationsList = Model.get_observations();
    views.listObservationsView("target", observationsList);

    let target = document.getElementById("target2");
    target.innerHTML = "";
}


// listens to "observationAdded" event
// displays profile of user (logged-in), as well as a list of that user's observations
// when an observation has been added successfully
window.addEventListener("observationAdded", function(e) {
    let loggedInUser = "!/users/0";
    window.location.hash = loggedInUser;
})
// listens to "modelUpdated" event
// calls "pageLinksHandler()" function
window.addEventListener("modelUpdated", function(e) {
    pageLinksHandler();
})


// pageLinksHandler - displays different views according to hash location
function pageLinksHandler() {    
    let hash = split_hash(window.location.hash);

    // if hash location is "#", display main page 
    if (hash.path === "") {
        mainDisplay();
    }
    // if hash location is "#!/users", display users list
    else if (hash.path === "users") {        
        if (hash.id === undefined) {
            usersListDisplay();
        } else {
            let users = Model.get_users();
            for (let i = 0; i < users.length; i++) {
                let userID = users[i].id;
                if (hash.id === userID.toString()) {
                    views.userView("target", Model.get_user(userID));
                    views.userObservationsView("target2", Model.get_user_observations(userID));
                }
            }
        }
    } 
    // if hash location is "#!/observations", display observations list
    else if (hash.path === "observations") {
        if (hash.id === undefined) {
            observationsListDisplay();
        } else {
            let observations = Model.get_observations();
            for (let i = 0; i < observations.length; i++) {
                let observationID = observations[i].id;
                if (hash.id === observationID.toString()) {
                    views.observationView("target", Model.get_observation(observationID));
                    document.getElementById("target2").innerHTML = "";
                }
            }
        }
    } 
    // if hash location is "#!/submit", display submission form
    else if (hash.path === "submit") {
        views.submitObservationView("target");
        let target = document.getElementById("target2");
        target.innerHTML = "";
        submitFormHandler();
    }
}
// submitFormHandler - handles error checking and submission of formdata
// calls add_observation() function to dispatch "observationAdded" event
function submitFormHandler() {
    let submissionForm = document.getElementById("submit-observation");

    // listens to "submit" event
    submissionForm.onsubmit = function(e) {           
        e.preventDefault();

        // capture errors from missing field requirements 
        let errors = formErrorHandler();
        // if errors exist, display them on-screen
        if (errors.length > 0) {
            let errorText = errors.join(" | ");
            let displayErrors = document.getElementById("form-error-messages");
            displayErrors.innerText = errorText;
        } else {
            // if there no errors returned, 
            // add formdata to observations
            const formdata = new FormData(this);
            Model.add_observation(formdata);

            Model.update_observations();
        }
    }
}
// formErrorHandler - detects missing fields
// returns array of errors of type String
function formErrorHandler() {
    let errors = [];

    if (temperature.value === "") {
        errors.push("Missing required field: temperature");
    }
    if (weather.value === "") {
        errors.push("Missing required field: weather");
    } 
    if (wind.value === "") {
        errors.push("Missing required field: wind");
    }
    if (location_inp.value === "") {
        errors.push("Missing required field: location");
    }
    if (height.value === "") {
        errors.push("Missing required field: height");
    }
    if (height.value < 0) {
        errors.push("Height cannot be less than 0");
    }
    if (girth.value === "") {
        errors.push("Missing required field: girth");
    }
    if (girth.value < 0) {
        errors.push("Girth cannot be less than 0");
    }
    if (leaf_size.value === "") {
        errors.push("Missing required field: leaf size");
    }
    if (leaf_shape.value === "") {
        errors.push("Missing required field: leaf shape");
    }
    if (bark_colour.value === "") {
        errors.push("Missing required field: bark colour");
    }
    if (bark_texture.value === "") {
        errors.push("Missing required field: bark texture");
    }

    return errors;
}


window.onload = function() {
    // updates and loads users and observations data
    Model.update_users();
    Model.update_observations();
}
window.onhashchange = pageLinksHandler;

