$(document).ready(function () {

    //Initialize firebase:
    var config = {
        apiKey: "AIzaSyBLTdvrb05ohoL2OzTe86h_g7a_3lDCiV0",
        authDomain: "train-schedule-94251.firebaseapp.com",
        databaseURL: "https://train-schedule-94251.firebaseio.com",
        projectId: "train-schedule-94251",
        storageBucket: "train-schedule-94251.appspot.com",
        messagingSenderId: "156753872036"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    //Display current time in jumbotron:
    function updateTime() {
        var now = moment();
        var displayNow = now.format("hh:mm:ss A");
        $("#current-time").text(displayNow);
    };
    //Display current time every second:
    setInterval(updateTime, 1000);

    // Create a submit button that add train schedules:
    $("#add").on("click", function (event) {
        event.preventDefault();
        //Make a sound on button click:
        var chooChoo = new Audio();
        chooChoo.src = "assets/choo-choo.mp3";
        chooChoo.play();

        //Grab the values from the input form:
        var name = $("#name").val().trim();
        var destination = $("#destination").val().trim();
        var start = $("#time-start").val().trim();
        console.log(start);

        var frequency = $("#frequency").val().trim();

        // Creates local "temporary" object for holding train data
        var newTrain = {
            name: name,
            destination: destination,
            start: start,
            frequency: frequency,
        };

        //Upload train data to database:
        database.ref().push(newTrain);

        //Clear the inputs:
        $("#name").val("");
        $("#destination").val("");
        $("#time-start").val("");
        $("#frequency").val("");
    });

    //Firebase event that takes the data and creates a row in the table:
    database.ref().on("child_added", function (snapshot) {
        console.log(snapshot.val());

        // Store everything into a variable:
        var storedName = snapshot.val().name;
        var storedDestination = snapshot.val().destination;
        var storedStart = snapshot.val().start;
        var storedFrequency = snapshot.val().frequency;

        //Dynamically calculate the times when the page loads with library (moment.js):

        // //First Time (pushed back 1 year to make sure it comes before current time):
        var firstTime = moment(storedStart, "HH:mm").subtract(1, "years");
        console.log("First time: ", firstTime);

        // //Current Time:
        var currentTime = moment();

        // //Difference between the times:
        var timeDifference = currentTime.diff(moment(firstTime), "minutes");
        console.log("Difference in time: " + timeDifference);

        // //Time apart (remainder):
        var remainder = timeDifference % storedFrequency;
        console.log("Remainder:", remainder);

        // //Minute Until Train:
        var minutesAway = storedFrequency - remainder;

        // //Next Train
        var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm A");

        // Create the new row:
        var newRow = $("<tr>").addClass("new-row").append(
            $("<td>").text(storedName),
            $("<td>").text(storedDestination),
            $("<td>").text(storedFrequency),
            $("<td>").text(nextTrain),
            $("<td>").text(minutesAway)
        );

        // Append the new row to the table:
        $("#table > tbody").append(newRow);
    });
});

