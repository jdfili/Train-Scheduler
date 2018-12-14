$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyDW-hWsc4m3X18NpR0P0ajR02hKWlb4Hus",
        authDomain: "train-scehduler.firebaseapp.com",
        databaseURL: "https://train-scehduler.firebaseio.com",
        projectId: "train-scehduler",
        storageBucket: "train-scehduler.appspot.com",
        messagingSenderId: "413163924670"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    $("#submit").on("click", function () {
        event.preventDefault();
        var name = $("#name").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = moment($("#time").val().trim(), "HH:mm").subtract(10, "years").format("X");
        var freq = $("#frequency").val().trim();
        
        var newTrain = {
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            freq: freq
        }

        database.ref().push(newTrain);
        
        $("#name").val("");
        $("#destination").val("");
        $("#time").val("");
        $("#frequency").val("")

    })
    database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {

       var data = childSnapshot.val();
       var trainNames = data.name;
       var trainDestination = data.destination;
       var trainFrequency = data.freq;
       var theFirstTrain = data.firstTrain;
        console.log(theFirstTrain);
        // Calculate the minutes until arrival using hardcore math
        // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time and find the modulus between the difference and the frequency  
       var tRemainder = moment().diff(moment.unix(theFirstTrain), "minutes") % trainFrequency;
       var tMinutes = trainFrequency - tRemainder;
    
        // To calculate the arrival time, add the tMinutes to the currrent time
       var tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    
        var table = `<tr>
        <td>${trainNames}</td>
        <td>${trainDestination}</td>
        <td>${trainFrequency}</td>
        <td>${tArrival}</td>
        <td>${tMinutes}</td></tr>`
        $("tbody").append(table);
    })
});
