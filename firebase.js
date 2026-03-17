const admin = require('firebase-admin');

// Thay vì require file JSON, ta đọc từ biến môi trường
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
module.exports = { db };

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