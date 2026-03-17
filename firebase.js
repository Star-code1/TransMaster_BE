const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Hàm lấy câu hỏi ngẫu nhiên theo chủ đề
async function getRandomQuestion(topic = "Tin tức") {
  const questionsRef = db.collection("questions");
  const snapshot = await questionsRef.where("topic", "==", topic).get();
  
  if (snapshot.empty) return null;
  
  const docs = snapshot.docs;
  const randomDoc = docs[Math.floor(Math.random() * docs.length)];
  return { id: randomDoc.id, ...randomDoc.data() };
}

module.exports = { db, getRandomQuestion };