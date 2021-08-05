export {homePageView, listUserView, userView, listObservationsView, observationView, submitObservationView, userObservationsView};

// applyTemplate - apply a template to some data
function applyTemplate(targetID, templateID, data) {

    let target = document.getElementById(targetID);

    let template = Handlebars.compile(
            document.getElementById(templateID).textContent
        );
    target.innerHTML = template(data);
}


// homePageView - generate a view of the most recent observations
// and view of top ten users based on number of observations made
function homePageView(targetID, mostRecent, target2ID, topTenUsers) {
    applyTemplate(targetID, "home-recent-template", {'mostRecent': mostRecent});
    applyTemplate(target2ID, "home-leaderboard-template", {'topTenUsers': topTenUsers});
}
// listUserView - generate a view of a list of users
// insert at 'targetID' in the document
function listUserView(targetID, users) {
    applyTemplate(targetID, "users-list-template", {'users': users});
}
// listObservationsView - generate a view of a list of observations
// insert at 'targetID' in the document
function listObservationsView(targetID, observations) {
    applyTemplate(targetID, "observations-list-template", {'observations': observations});
}

// userView - generate a view of an individual user
// insert at 'targetID' in the document
function userView(targetID, userInfo) {
    applyTemplate(targetID, "user-template", userInfo);
}
// userObservationsView - generate a view of user observations
// insert at 'targetID' in the document
function userObservationsView(targetID, userObservations) {
    applyTemplate(targetID, "user-observations-template", {'userObservations': userObservations});
}
// observationView - generate a view of an individual observation
// insert at 'targetID' in the document
function observationView(targetID, observationInfo) {
    applyTemplate(targetID, "observation-template", observationInfo);
}
// submitObservationView - generate a view of the submission form
// insert at 'targetID' in the document
function submitObservationView(targetID) {
    let target = document.getElementById(targetID)
    
    let template = Handlebars.compile(
            document.getElementById("observation-form").textContent
        );

    target.innerHTML = template();
}
