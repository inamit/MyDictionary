// Initialize Firebase
var config = {
  apiKey: "AIzaSyBdfsnBLc6HJZU8SAcJCc1C8W4ZrlSECgE",
  authDomain: "mydictionary-71b94.firebaseapp.com",
  databaseURL: "https://mydictionary-71b94.firebaseio.com",
  projectId: "mydictionary-71b94",
  storageBucket: "",
  messagingSenderId: "503355081713"
};
firebase.initializeApp(config);

var firestore = firebase.firestore(); // Firestore instance

const dbRef = firestore.collection("users"); // Firestore referance

var i = 0;

function handleWord(word) {
  var uploadWordArr = [];
  while (word.indexOf(" ") != -1) // checks for spaces
    word = word.replace(" ", ""); // delete spaces
  word = word.split(/\n/); // split the two lines
  for (var i = 0; i < word.length; i++) {
    var arr = word[i].split(','); // split each line by ,
    for (var j = 0; j < arr.length; j++)
      uploadWordArr.push(arr[j]); // put the value into the new array
  }
  return uploadWordArr;
}
function uploadToFirestore() {
  if (firebase.auth().currentUser.uid != null) {
    $('#loading').show();
    var UID = firebase.auth().currentUser.uid; // User's uniqe ID
    // Verb
    var verb = document.getElementById("verb").value;
    var verbUpload = "", verbTransUpload = "";
    if (verb != "") {
      var verbArr = handleWord(verb);
      if (verbArr.length > 2) {
        for (var i = 0; i < verbArr.length; i++) {
          if (i % 2 != 0) // Odd cells are translations
            verbTransUpload += verbArr[i] + ",";
          else
            verbUpload += verbArr[i] + ",";
        }
      } else {
        verbUpload = verbArr[0];
        verbTransUpload = verbArr[1];
      }
    }
    // Adj
    var adj = document.getElementById("adj").value;
    var adjUpload = "", adjTransUpload = "";
    if (adj != "") {
      var adjArr = handleWord(adj);
      if (adjArr.length > 2) {
        for (var i = 0; i < adjArr.length; i++) {
          if (i % 2 != 0)
            adjTransUpload += " " + adjArr[i];
          else
            adjUpload += " " + adjArr[i];
        }
      } else {
        adjUpload = adjArr[0];
        adjTransUpload = adjArr[1];
      }
    }
    // Adv
    var adv = document.getElementById("adv").value;
    var advUpload = "", advTransUpload = "";
    if (adv != "") {
      var advArr = handleWord(adv);
      if (advArr.length > 2) {
        for (var i = 0; i < advArr.length; i++) {
          if (i % 2 != 0)
            advTransUpload += " " + advArr[i];
          else
            advUpload += " " + advArr[i];
        }
      } else {
        advUpload = advArr[0];
        advTransUpload = advArr[1];
      }
    }
    // Noun
    var noun = document.getElementById("noun").value;
    var nounUpload = "", nounTransUpload = "";
    if (noun != "") {
      var nounArr = handleWord(noun);
      if (nounArr.length > 2) {
        for (var i = 0; i < nounArr.length; i++) {
          if (i % 2 != 0)
            nounTransUpload += " " + nounArr[i];
          else
            nounUpload += " " + nounArr[i];
        }
      } else {
        nounUpload = nounArr[0];
        nounTransUpload = nounArr[1];
      }
    }

    var date = new Date();
    dbRef.doc(UID).collection("words").add({
      "verb":verbUpload,
      "verbTrans":verbTransUpload,
      "noun":nounUpload,
      "nounTrans":nounTransUpload,
      "adjective":adjUpload,
      "adjTrans": adjTransUpload,
      "adverb": advUpload,
      "advTrans": advTransUpload,
      "known": 0,
      "timestamp": date
    })
    .then(function(docRef) {
      $('#loading').hide();
      $('#modal-1').find("textarea").val("");
      $('#modal-1').modal('hide');
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        $('#loading').hide();
        console.error("Error adding document: ", error);
    });
  }
}
// function addRow(verb, noun, adj, adv, level, verbTrans, nounTrans) {
//   document.getElementById("tableBody").innerHTML += '<tr id="word0"></tr>'; // creates the first row
//   var row = '<td><div id="verb0" data-toggle="popover" data-original-title="' + verb + ' - ' + verbTrans + " <button type='button' class='close' data-dismiss='popover' aria-label='Close'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button>" + '" data-content="Definitions are coming soon!!!" onclick="' + "openPopover('verb0')" + '" data-trigger="focus" style="display: inline-block">' + verb + '</div></td>' +
//             '<td><div id="noun0" data-toggle="popover" data-original-title="' + noun + ' - ' + nounTrans + " <button type='button' class='close' data-dismiss='popover' aria-label='Close'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button>" + '" data-content="Definitions are coming soon!!!" onclick="' + "openPopover('noun0')" + '" data-trigger="focus" style="display: inline-block">' + noun + '</div></td>' +
//             '<td><div id="adj0" data-toggle="popover">' + adj + '</div></td>' +
//             '<td><div id="adv0" data-toggle="popover">' + adv + "</div></td>"; // Creates the cells with data
//   document.getElementById("word" + i).innerHTML = row; // Inserts the row to the view
//   switch (level) { // Check the knowledge level
//     case 0:
//       document.getElementById("word" + i).style.backgroundColor = "#f25337";
//       break;
//     case 1:
//       document.getElementById("word" + i).style.backgroundColor = "#f9e934";
//       break;
//     case 2:
//       document.getElementById("word" + i).style.backgroundColor = "#46ff46";
//       break;
//     default:
//       break;
//   }
//   document.getElementById("tableBody").innerHTML += '<tr id="word' + (i+1) + '"></tr>'; // Creates the next row
//   i++;
// }
function addRow(verbRow, nounRow, adj, adv, level) {
  document.getElementById("tableBody").innerHTML += '<tr id="word0"></tr>'; // creates the first row
  var row = verbRow + nounRow +
            '<td><div id="adj0" data-toggle="popover">' + adj + '</div></td>' +
            '<td><div id="adv0" data-toggle="popover">' + adv + "</div></td>"; // Creates the cells with data
  document.getElementById("word" + i).innerHTML = row; // Inserts the row to the view
  switch (level) { // Check the knowledge level
    case 0:
      document.getElementById("word" + i).style.backgroundColor = "#f25337";
      break;
    case 1:
      document.getElementById("word" + i).style.backgroundColor = "#f9e934";
      break;
    case 2:
      document.getElementById("word" + i).style.backgroundColor = "#46ff46";
      break;
    default:
      break;
  }
  document.getElementById("tableBody").innerHTML += '<tr id="word' + (i+1) + '"></tr>'; // Creates the next row
  i++;
}
function loadWords() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Signed in
      $('#loading').show();
      var UID = user.uid;
      dbRef.doc(UID).collection("words").get()
      .then(function (querySnapshot) {
        if (!(querySnapshot.empty)) {
          querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots

                // Verb
                var verb = doc.data()["verb"];
                var verbTrans = doc.data()["verbTrans"];
                var verbRow = "<td>";
                if (verb == "") {
                  verb = "-";
                  verbRow += '<div style="display: inline-block">' + verb + '</div>';
                } else {
                  if (verb.indexOf(" ") != -1) {
                    verb = verb.replace(" ", "");
                    verb = verb.replace(/ /g, "\n");
                    verb = verb.split("\n");
                    verbTrans = verbTrans.split(",");
                    if (verb[0] == "")
                      verb.shift();
                    for (var i = 0; i < verb.length; i++) {
                      verbRow += '<div id="verb' + i + '" data-toggle="popover" data-original-title="' + verb[i] + ' - ' + verbTrans[i] + ' <button type="button" onclick="hidePopover(' + "'verb" + i + "')" + '" class="close" ' + "data-dismiss='popover' aria-label='Close'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button>" + '" data-content="Definitions are coming soon!!!" onclick="' + "openPopover('verb" + i + "')" + '" data-trigger="focus" style="display: inline-block">' + verb[i] + '</div><br />';
                      // verb = verb.replace("\n", '</div><div id="verb' + i + '"  data-toggle="popover" data-original-title="' + verb + ' - ' + verbTrans + " <button type='button' class='close' data-dismiss='popover' aria-label='Close'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button>" + '" data-content="Definitions are coming soon!!!" onclick="' + "openPopover('verb" + i + "')" + '" data-trigger="focus" style="display: inline-block">' + verb + '</div>');
                    }
                  } else {
                    verbRow += '<div id="verb0" data-toggle="popover" data-original-title="' + verb + ' - ' + verbTrans + " <button type='button' class='close' data-dismiss='popover' aria-label='Close'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button>" + '" data-content="Definitions are coming soon!!!" onclick="' + "openPopover('verb0')" + '" data-trigger="focus" style="display: inline-block">' + verb + '</div>';
                  }
                }
                verbRow += "</td>";
                // Noun
                var noun = doc.data()["noun"];
                var nounTrans = doc.data()["nounTrans"];
                var nounRow = "<td>";
                if (noun == "") {
                  noun = "-";
                  nounRow += '<div style="display: inline-block">' + noun + '</div>';
                } else {
                  if (noun.indexOf(" ") != -1) {
                    // noun = noun.replace(" ", "");
                    // console.log("noun removed spaces", "=>", noun);
                    noun = noun.replace(/ /g, "\n");
                    console.log("noun replaced spaces with enter", "=>", noun);
                    noun = noun.split("\n");
                    nounTrans = nounTrans.split(",");
                    if (noun[0] == "")
                      noun.shift();
                    console.log("noun splitted by enter", "=>", noun);
                    for (var i = 0; i < noun.length; i++) {
                      nounRow += '<div id="noun' + i + '" data-toggle="popover" data-original-title="' + noun[i] + ' - ' + nounTrans[i] + " <button type='button' class='close' data-dismiss='popover' aria-label='Close'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button>" + '" data-content="Definitions are coming soon!!!" onclick="' + "openPopover('noun" + i + "')" + '" data-trigger="focus" style="display: inline-block">' + noun[i] + '</div><br />';
                      // noun = noun.replace("\n", '</div><div id="noun' + i + '"  data-toggle="popover" data-original-title="' + noun + ' - ' + nounTrans + " <button type='button' class='close' data-dismiss='popover' aria-label='Close'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button>" + '" data-content="Definitions are coming soon!!!" onclick="' + "openPopover('noun" + i + "')" + '" data-trigger="focus" style="display: inline-block">' + noun + '</div>');
                    }
                  } else {
                    nounRow += '<div id="noun0" data-toggle="popover" data-original-title="' + noun + ' - ' + nounTrans + " <button type='button' class='close' data-dismiss='popover' aria-label='Close'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button>" + '" data-content="Definitions are coming soon!!!" onclick="' + "openPopover('noun0')" + '" data-trigger="focus" style="display: inline-block">' + noun + '</div>';
                  }
                }
                nounRow += "</td>";
                // Adj
                var adj = doc.data()["adjective"];
                if (adj == "") {
                  adj = "-";
                }
                if (adj.indexOf(" ") != -1) {
                  adj = adj.replace(" ", "");
                  adj = adj.replace(/ /g, "\n");
                }
                for (var i = 1; i <= adj.split("\n").length; i++) {
                  adj = adj.replace("\n", '</div><div id="adj' + i + '" data-toggle="popover">');
                }
                // Adv
                var adv = doc.data()["adverb"];
                if (adv == "") {
                  adv = "-";
                }
                if (adv.indexOf(" ") != -1) {
                  adv = adv.replace(" ", "");
                  adv = adv.replace(/ /g, "\n");
                }
                for (var i = 1; i <= adv.split("\n").length; i++) {
                  adv = adv.replace("\n", '</div><div id="adv' + i + '" data-toggle="popover">');
                }
                // Level
                var level = doc.data()["known"];
                // addRow(verb, noun, adj, adv, level, verbTrans, nounTrans);
                addRow(verbRow, nounRow, adj, adv);
            });
        } else {
          document.getElementById("tableBody").innerHTML += '<tr id="word0"><td scope="row">Enter your first word</td><td></td><td></td><td></td></tr>';
          document.getElementById("tableBody").innerHTML += '<tr id="word1"></tr>';
          document.getElementById("searchIcon").className += " md-inactive";
        }
      })
      .catch(function (error) {
        console.log("There is an error fetching: " + error);
      });
      var date = new Date();
      dbRef.doc(UID).collection("words").where("timestamp", ">", date)
        .onSnapshot(function(querySnapshot){
          querySnapshot.forEach(function(doc) {
            // Verb
            var verb = doc.data()["verb"];
            if (verb == "") {
              verb = "-";
            }
            if (verb.indexOf(" ") != -1) {
              verb = verb.replace(" ", "");
              verb = verb.replace(" ", "</div><div>");
            }
            // Noun
            var noun = doc.data()["noun"];
            if (noun == "") {
              noun = "-";
            }
            if (noun.indexOf(" ") != -1) {
              noun = noun.replace(" ", "");
              noun = noun.replace(" ", "</div><div>");
            }
            // Adj
            var adj = doc.data()["adjective"];
            if (adj == "") {
              adj = "-";
            }
            if (adj.indexOf(" ") != -1) {
              adj = adj.replace(" ", "");
              adj = adj.replace(" ", "</div><div>");
            }
            // Adv
            var adv = doc.data()["adverb"];
            if (adv == "") {
              adv = "-";
            }
            if (adv.indexOf(" ") != -1) {
              adv = adv.replace(" ", "");
              adv = adv.replace(" ", "</div><div>");
            }
            // Level
            var level = doc.data()["known"];
            addRow(verb, noun, adj, adv, level);
          });
        });
        $('#loading').hide();
    } else {
      // Not signed in
      $('#loading').show();
      document.getElementById("tableBody").innerHTML += '<tr id="word0"><td scope="row">First, you need to sign in</td><td></td><td></td><td></td></tr>';
      document.getElementById("tableBody").innerHTML += '<tr id="word1"></tr>';
      document.getElementById("searchIcon").className += " md-inactive";
      $('#loading').hide();
    }
  });
  // $('#loading').hide();
}
window.onload = function() {
  //Handle Account Status
  loadWords();
}
function chkForUser() {
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
    window.location = './UserInfo.html';
  } else {
    // No user is signed in.
    window.location = './Login.html';
  }
}
function openPopover(id) {
  $("#"+id).popover({
    placement : 'right',
    container: document.getElementById(id),
    html: true,
    template: '<div class="popover" role="tooltip"><div class="arrow"></div>'+
              '<h3 class="popover-header">Popover title</h3>' +
              '<div class="popover-body">' +
              'Popover content</div><img alt="hear" src="./volume.png" /></div>'
  })
  .on('shown.bs.popover', function() {
    //hide any visible comment-popover
    $("[data-toggle=popover]").not(this).popover('hide');
    var $this = $(this);
    //close on cancel
    $('.popover-cancel').click(function() {
        $this.popover('hide');
    });
    //update link text on submit
    $('.popover-submit').click(function() {
        $this.popover('hide');
    });
  });
}
function hidePopover(id) {
  $("#" + id).popover("hide");
}
