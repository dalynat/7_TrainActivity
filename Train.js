// Set Firebase config
var config = {
    apiKey: "AIzaSyC4CvriMt724tuw8N6mVF-_Lj36SmwcBag",
    authDomain: "train-times-2be80.firebaseapp.com",
    databaseURL: "https://train-times-2be80.firebaseio.com",
    projectId: "train-times-2be80",
    storageBucket: "train-times-2be80.appspot.com",
    messagingSenderId: "115339216150"
  };
// Initialize Firebase
firebase.initializeApp(config);
var trainData = firebase.database();
// Get the Data from our Form
$("#addTrain").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#frequency").val().trim();
// Push our Train Data to our Database
    var newTrain ={
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    };
// Clear the form to make way for new data
    trainData.ref().push(newTrain);
    $('#trainName').val('');
    $('#destination').val('');
    $('#firstTrain').val('');
    $('#frequency').val('');
});
//Get the user suppliedtrain data from the table
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
//Snapshot of the data to send to firebase
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;
//Determine the next train time
    var timeArr = tFirstTrain.split(":");
    var trainTime = moment()
    .hours(timeArr[0])
    .minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
      } else {
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        tArrival = moment()
        .add(tMinutes, "m")
        .format("hh:mm A");
    }
// Append all the data to the table
    $("#train-table > tbody").append(
        $("<tr>").append(
          $("<td>").text(tName),
          $("<td>").text(tDestination),
          $("<td>").text(tFrequency),
          $("<td>").text(tArrival),
          $("<td>").text(tMinutes)
        )
      );
});