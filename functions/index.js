/* eslint-disable max-len */
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
});
exports.getNewMessage = functions.firestore.document("users/{userId}/conversations/{messageId}")
	.onCreate(async (doc, context) => {
	  const db = admin.firestore();
	  const date = doc.data().date;
      const otherId = doc.data().otherId;
	  const userId = context.params.userId;
	  let userToken = "";
	  try {
		const data = await db.collection("users").doc(userId).get();
		const token = data.data().token;
		  userToken = token;
	  } catch (error) {
		console.log(error);
	  }
	  const message = {
		notification: {
		  title: date,
		  body: otherId,
		},
		token: userToken,
	  };
	  admin.messaging().send(message)
		  .then((responce) => {
		    console.log(responce);
		  })
		  .catch((error) => {
		    console.log(error);
		  });
	});

