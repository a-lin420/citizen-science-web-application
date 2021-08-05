export {Model};

/* 
 * Model class to support the Citizen Science application
 * this class provides an interface to the web API and a local
 * store of data that the application can refer to.
 * The API generates two different events:
 *   "modelChanged" event when new data has been retrieved from the API
 *   "observationAdded" event when a request to add a new observation returns
*/

const Model = {

    observations_url: '/api/observations', 
    users_url:  '/api/users',   
    
    // this will hold the data stored in the model
    data: {
        observations: [],
        users: []
    },

    // update_users - retrieve the latest list of users 
    //    from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    // with the model as the event detail
    update_users: function() {
        fetch(this.users_url)
        .then(
            (response) => response.json()
        )
        .then(
            (data) => {
                let usersList = [];
                for (let i = 0; i < data.length; i++) {
                    usersList.push(data[i]); 
                }                                
                this.data.users = usersList;

                let updateUsersEvent = new CustomEvent("modelUpdated", { detail: this });
                window.dispatchEvent(updateUsersEvent);
            }
        )
    },

    // update_observations - retrieve the latest list of observations
    //   from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    // with the model as the event detail
    update_observations: function() {
        fetch(this.observations_url)
        .then(
            (response) => response.json()
        )
        .then(
            (data) => {
                let observationsArray = [];
                for (let i = 0; i < data.length; i++) {
                    observationsArray.push(data[i]);
                }
                this.data.observations = observationsArray;

                let updateObservationsEvent = new CustomEvent("modelUpdated", { detail: this });
                window.dispatchEvent(updateObservationsEvent);
            }
        )
    },

    // get_observations - return an array of observation objects
    get_observations: function() {
        return this.data.observations;
    },

    // get_observation - return a single observation given its id
    get_observation: function(observationid) {
        let observationsArr = this.get_observations();

        for (let i = 0; i < observationsArr.length; i++) {
            if (observationsArr[i].id === observationid) {
                return observationsArr[i];
            }
        }
        console.log("observation does not exist");
    },
 
    set_observations: function(observations) {
        this.data.observations = observations;
    },

    // add_observation - add a new observation by submitting a request
    //   to the server API
    //   formdata is a FormData object containing all fields in the observation object
    // when the request is resolved, creates an "observationAdded" event
    //  with the response from the server as the detail
    add_observation: function(formdata) {
        fetch(this.observations_url, {
            method: 'post',
            body: formdata
        })
        .then((response) => {      
            return response.json();
        })
        .then((data) => {
            console.log(data);

            let addObservationEvent = new CustomEvent("observationAdded", {detail: data});
            window.dispatchEvent(addObservationEvent);
        })
    },

    // get_user_observations - return just the observations for
    //   one user as an array
    get_user_observations: function(userid) {
        let observationsList = this.get_observations();
        let userObservations = [];

        for (let i = 0; i < observationsList.length; i++) {
            if (observationsList[i].participant === userid) {
                userObservations.push(observationsList[i]);
            }
        }

        userObservations.sort((a, b) => {
            if (a.timestamp < b.timestamp) {
                return 1;
            }
            if (a.timestamp > b.timestamp) {
                return -1;
            }
            return 0;
        });
        return userObservations;
    },

    // get_recent_observations - return the N most recent
    //  observations, ordered by timestamp, most recent first
    get_recent_observations: function(N) {
        let observationsArr = this.get_observations();
        let mostRecentArray = observationsArr.slice();

        mostRecentArray.sort((a, b) => {
            if (a.timestamp < b.timestamp) {
                return 1;
            }
            if (a.timestamp > b.timestamp) {
                return -1;
            }
            return 0;
        });
        
        return mostRecentArray.slice(0, N);
    },

    /* 
    * Users
    */
    // get_users - return the array of users
    get_users: function() {
        return this.data.users;
    },

    // set_users - set the array of users
    set_users: function(users) {
        this.data.users = users;
    },

    // get_user - return the details of a single user given 
    //    the user id
    get_user: function(userid) {
        let usersList = this.get_users();

        for (let i = 0; i < usersList.length; i++) {
            if (usersList[i].id === userid) {
                return usersList[i];
            }
        }
        return null;
    },

    // get_ordered_users - returns sorted array of users
    // ascending order according to user ID
    get_ordered_users: function() {
        let usersList = this.get_users();
        let ordered = usersList.slice();

        ordered.sort((a, b) => {
            return a.id - b.id;
        })

        return ordered;
    },

    // get_top_ten_users - return array of ordered users
    // ranking is based on the number of observations made
    get_top_ten_users: function() {
        let usersList = this.get_users();
        let topTen = usersList.slice();

        topTen.sort((a, b) => {
            let aSize = this.get_user_observations(a.id).length;
            let bSize = this.get_user_observations(b.id).length;
            return bSize - aSize;
        });
        
        return topTen.slice(0, 10);
    },
};