/* <tr>
        <td>Train Name</td>
        <td>Destination</td>
        <td>Next Arrival</td>
        <td>Frequecy (min)</td>
        <td>Minutes Away</td>
    </tr> */

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
    //Grab the format of the time entered:
    var start = moment($("#time-start").val().trim(), "HH:mm");
    console.log(start.format("X"));
    var frequency = $("#frequency").val().trim();
    console.log(frequency);
    // // First Time (pushed back 1 year to make sure it comes before current time)
    var startTime = moment(start, "HH:mm").subtract(1, "years");
    console.log(startTime);
    // //Current Time:
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // //Difference between the times:
    var timeDifference = moment().diff(moment(startTime), "minutes");
    console.log("DIFFERENCE IN TIME: " + timeDifference);

    // //Time apart (remainder):
    var remainder = timeDifference % frequency;
    console.log(remainder);

    //Minute Until Train:
    var minutesAway = frequency - remainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    var nextTrain = moment().add(minutesAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: name,
        destination: destination,
        firstTrain: start.format("hh:mm A"), //For calculation reference
        currentTime: moment(currentTime).format("hh:mm"), //For calculation reference
        nextTrain: moment(nextTrain).format("hh:mm A"),
        frequency: frequency,
        minutesAway: minutesAway
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
    var addedName = snapshot.val().name;
    var addedDestination = snapshot.val().destination;
    var addedArrival = snapshot.val().nextTrain;
    var addedFrequency = snapshot.val().frequency;
    var addedMinutesAway = snapshot.val().minutesAway;

    // Create the new row:
    var newRow = $("<tr>").append(
        $("<td>").text(addedName),
        $("<td>").text(addedDestination),
        $("<td>").text(addedFrequency),
        $("<td>").text(addedArrival),
        $("<td>").text(addedMinutesAway)
    );

    // Append the new row to the table:
    $("#table > tbody").append(newRow);
});
