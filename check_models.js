// server/check_models.js
const { GoogleAIFileManager, GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Cách gọi chuẩn cho phiên bản mới nhất
const { GoogleAICentral } = require("@google/generative-ai"); 

async function listModels() {
  try {
    // Thử cách gọi đơn giản nhất cho hầu hết phiên bản
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();

    console.log("--- Danh sách các Model khả dụng ---");
    if (data.models) {
      data.models.forEach((m) => {
        console.log(`Model ID: ${m.name} | Display Name: ${m.displayName}`);
      });
    } else {
      console.log("Không tìm thấy model nào. Kiểm tra lại API Key.");
      console.log(data); // In ra lỗi nếu có
    }
    console.log("------------------------------------");
  } catch (error) {
    console.error("Lỗi kết nối:", error.message);
  }
}

listModels();