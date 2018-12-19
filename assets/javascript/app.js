// Train Scheduler logic

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBnL-xbSXO3bWMTKo1s46q5qJw14FoOHaw",
    authDomain: "scheduledtrains.firebaseapp.com",
    databaseURL: "https://scheduledtrains.firebaseio.com",
    projectId: "scheduledtrains",
    storageBucket: "scheduledtrains.appspot.com",
    messagingSenderId: "777482862001"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding train schedule
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // user input in form is stored in variables
    var trainName = $("#train-name-input").val().trim();
    var traindestination = $("#destination-input").val().trim();
    var firstTrainTime = moment($("#first-train-input").val().trim(), "HH:mm").format("X");
    var trainfrequency = $("#frequency-input").val().trim();
  
    var trainInfo = {
      name: trainName,
      destination: traindestination,
      startTime: firstTrainTime,
      frequency: trainfrequency
    };
  
    // Input train data to the database
    database.ref().push(trainInfo);
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  

  // 3. Create Firebase event for adding train info to the database and a row in screen
  database.ref().on("child_added", function(trainSnapshot) {
    console.log(trainSnapshot.val());
  
    // Store everything into a variable.
    var trainName = trainSnapshot.val().name;
    var traindestination = trainSnapshot.val().destination;
    var firstTrainTime = trainSnapshot.val().startTime;
    var trainfrequency = trainSnapshot.val().frequency;

  
    var startTime = moment.unix(firstTrainTime).format("HH:mm");
    console.log("First train time stored in Firebase :: "+startTime);  

    var timeDiff = moment().diff(moment(firstTrainTime,"X"),"minutes");
    console.log("Time Difference from first train :: "+timeDiff);
    console.log("Train frequency from Firebase :: "+trainfrequency);

    var minutes2Train = trainfrequency-((timeDiff)%(trainfrequency));
    console.log("Minutes to next train  :: "+minutes2Train);

    var nextTrain = moment().clone();
    nextTrain.add(minutes2Train,'minutes');
    nextTrain = nextTrain.format("HH:mm");
    console.log("Next Train in Minutes :: "+nextTrain);

  
    // Create the new row in screen
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(traindestination),
      $("<td>").text(trainfrequency),
      $("<td>").text(nextTrain),
      $("<td>").text(minutes2Train)
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
 