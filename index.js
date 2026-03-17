const express = require('express');
const Groq = require("groq-sdk");
const cors = require('cors');
require('dotenv').config();
const { db } = require("./firebase"); 

const app = express();
app.use(cors(), express.json());

app.use(cors({
  origin: 'https://trans-master-fe.vercel.app' // Thay bằng link web thật của ông
}));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


// 1. API Lấy câu hỏi lọc theo Category và Direction
app.get('/api/question', async (req, res) => {
    const { category, direction } = req.query; 
    try {
        let query = db.collection("questions").where("direction", "==", direction);
        if (category && category !== 'all') {
            query = query.where("category", "==", category);
        }
        
        const snapshot = await query.get();
        if (snapshot.empty) return res.status(404).json({ error: "Chưa có câu hỏi cho mục này" });

        const docs = snapshot.docs;
        const randomDoc = docs[Math.floor(Math.random() * docs.length)];
        res.json({ id: randomDoc.id, ...randomDoc.data() });
    } catch (error) {
        res.status(500).json({ error: "Lỗi kết nối database" });
    }
});

// 2. API Chấm điểm với Prompt giáo viên chi tiết hơn
app.post('/api/grade', async (req, res) => {
    const { originalText, userTranslation, direction } = req.body;

    try {
        const chatCompletion = await groq.chat.completions.create({
    messages: [
        {
            role: "system",
            content: `Bạn là một chuyên gia ngôn ngữ và giáo viên dịch thuật Trung - Việt tinh tế.
            
            TÍNH CÁCH:
            - Thân thiện, khích lệ nhưng chuyên nghiệp.
            - Không chỉ bắt lỗi đúng/sai, mà tập trung vào "sắc thái" (ví dụ: dùng từ này thì trang trọng hơn, dùng từ kia thì tự nhiên hơn).
            - Giải thích logic ngôn ngữ (như cách dùng "了", cách chọn từ "企业" thay vì "公司").

            QUY TẮC TRẢ LỜI:
            1. Điểm số: Chấm dựa trên độ trôi chảy và sát nghĩa.
            2. teacher_message: Viết một đoạn văn ngắn gọn, nhận xét tổng quan về bài dịch. Nhấn mạnh vào điểm tốt trước, sau đó mới góp ý nhẹ nhàng.
            3. analysis: Chia nhỏ câu ra thành các cụm từ quan trọng để nhận xét riêng biệt.
            
            ĐỊNH DẠNG TRẢ VỀ: Duy nhất JSON (không kèm văn bản thừa).`
        },
        {
            role: "user",
            content: `Hãy chấm điểm bài tập này:
            - Hướng dịch: ${direction} (zh-vi hoặc vi-zh)
            - Câu gốc: "${originalText}"
            - Người dùng dịch: "${userTranslation}"

            Trả về JSON theo mẫu:
            {
              "score": (số từ 0-100),
              "teacher_message": "Nhận xét tổng quan như trong ảnh...",
              "analysis": [
                {
                  "part": "Cụm từ gốc đang xét",
                  "user_work": "Chỗ người dùng đã dịch",
                  "better_way": "Các phương án hay hơn (phân tách bằng dấu /)",
                  "why": "Giải thích chi tiết về sắc thái, ngữ pháp như một giáo viên thực thụ."
                }
              ]
            }`
        }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
});

        const feedback = JSON.parse(chatCompletion.choices[0].message.content);

        res.json(feedback);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI lỗi" });
    }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));