const data = require('./data');
const db = data.database();
const ref = db.ref('oscar-movies');

ref.once("value", function(snapshot) {
    console.log(snapshot)
    snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        console.log(childData.getChild('Actors'))
    });
});