// server/seeder.js
const admin = require("firebase-admin");
const Groq = require("groq-sdk");
require('dotenv').config();

// 1. Cấu hình Firebase (Dùng chung file serviceAccountKey.json đã có)
const serviceAccount = require("./serviceAccountKey.json");
if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 2. Danh sách câu thô bạn muốn nạp (Bạn có thể thêm hàng trăm câu ở đây)
const rawData = [
  // --- KINH DOANH (BUSINESS) ---
  { content: "全球通货膨胀对小微企业造成了巨大压力", category: "business", direction: "zh-vi" },
  { content: "Việc đa dạng hóa danh mục đầu tư giúp giảm thiểu rủi ro tài chính", category: "business", direction: "vi-zh" },
  { content: "双方在平等互利的基础上签署了战略合作协议", category: "business", direction: "zh-vi" },
  { content: "Chiến dịch marketing lần này tập trung vào phân khúc khách hàng trẻ", category: "business", direction: "vi-zh" },
  { content: "由于市场竞争激烈，该公司不得不调整经营策略", category: "business", direction: "zh-vi" },
  { content: "Doanh thu quý ba tăng trưởng 15% so với cùng kỳ năm ngoái", category: "business", direction: "vi-zh" },
  { content: "跨境电子商务正成为国际贸易的新引擎", category: "business", direction: "zh-vi" },
  { content: "Chúng ta cần tối ưu hóa chi phí vận hành để tăng lợi nhuận", category: "business", direction: "vi-zh" },
  { content: "该项目的投资回报率超出了我们的预期", category: "business", direction: "zh-vi" },
  { content: "Thương hiệu này đang tìm kiếm đại lý phân phối tại thị trường Việt Nam", category: "business", direction: "vi-zh" },

  // --- XÃ HỘI (SOCIAL) ---
  { content: "社交媒体的普及改变了人们获取信息的方式", category: "social", direction: "zh-vi" },
  { content: "Vấn đề già hóa dân số đang đặt ra nhiều thách thức cho an sinh xã hội", category: "social", direction: "vi-zh" },
  { content: "志愿者们为改善社区环境做出了巨大贡献", category: "social", direction: "zh-vi" },
  { content: "Khoảng cách giàu nghèo là một bài toán khó đối với các nước đang phát triển", category: "social", direction: "vi-zh" },
  { content: "保护文化遗产是全人类共同的责任", category: "social", direction: "zh-vi" },
  { content: "Thói quen tiêu dùng xanh đang dần trở thành xu hướng toàn cầu", category: "social", direction: "vi-zh" },
  { content: "现代女性在职场中发挥着越来越重要的作用", category: "social", direction: "zh-vi" },
  { content: "Giáo dục kỹ năng sống cho trẻ em là vô cùng cấp thiết", category: "social", direction: "vi-zh" },
  { content: "人工智能的发展引发了关于伦理道德的广泛讨论", category: "social", direction: "zh-vi" },
  { content: "Việc bảo vệ quyền lợi người lao động luôn được ưu tiên hàng đầu", category: "social", direction: "vi-zh" },

  // --- HSK 4 ---
  { content: "尽管天气很冷，他还是坚持每天跑步", category: "hsk4", direction: "zh-vi" },
  { content: "Dù công việc bận rộn nhưng cô ấy vẫn học thêm ngoại ngữ", category: "hsk4", direction: "vi-zh" },
  { content: "这台洗衣机的质量挺不错的，价格也合适", category: "hsk4", direction: "zh-vi" },
  { content: "Lần đi du lịch này để lại cho tôi ấn tượng rất sâu sắc", category: "hsk4", direction: "vi-zh" },
  { content: "不管遇到什么困难，我们都要积极面对", category: "hsk4", direction: "zh-vi" },
  { content: "Anh ấy không những thông minh mà còn rất nhiệt tình giúp đỡ người khác", category: "hsk4", direction: "vi-zh" },
  { content: "请大家排好队，按照顺序进入场馆", category: "hsk4", direction: "zh-vi" },
  { content: "Bạn phải chú ý an toàn khi lái xe vào buổi đêm", category: "hsk4", direction: "vi-zh" },
  { content: "通过这次比赛，我学到了很多宝贵的经验", category: "hsk4", direction: "zh-vi" },
  { content: "Tôi vẫn chưa quyết định có nên tham gia buổi tiệc tối nay không", category: "hsk4", direction: "vi-zh" },

  // --- HSK 5 ---
  { content: "良好的沟通技巧是成功解决矛盾的关键", category: "hsk5", direction: "zh-vi" },
  { content: "Chúng ta nên trân trọng những gì mình đang có thay vì phàn nàn", category: "hsk5", direction: "vi-zh" },
  { content: "这种药对缓解头痛有显著的效果", category: "hsk5", direction: "zh-vi" },
  { content: "Duy trì chế độ ăn uống lành mạnh giúp tăng cường hệ miễn dịch", category: "hsk5", direction: "vi-zh" },
  { content: "他在会议上提出了许多具有建设性的意见", category: "hsk5", direction: "zh-vi" },
  { content: "Việc thích nghi với môi trường mới luôn cần một khoảng thời gian", category: "hsk5", direction: "vi-zh" },
  { content: "由于缺乏经验，他在谈判中处于被动地位", category: "hsk5", direction: "zh-vi" },
  { content: "Sự kiên trì là yếu tố quyết định để đạt được mục tiêu dài hạn", category: "hsk5", direction: "vi-zh" },
  { content: "专家建议青少年应减少使用电子产品的时间", category: "hsk5", direction: "zh-vi" },
  { content: "Phong cảnh nơi đây thật khiến lòng người cảm thấy thư thái", category: "hsk5", direction: "vi-zh" },

  // --- HSK 6 ---
  { content: "文学作品往往折射出一个时代的社会面貌", category: "hsk6", direction: "zh-vi" },
  { content: "Sự phát triển của khoa học công nghệ là một con dao hai lưỡi", category: "hsk6", direction: "vi-zh" },
  { content: "他潜心钻研学术，在生物领域取得了突破性进展", category: "hsk6", direction: "zh-vi" },
  { content: "Chúng ta cần có cái nhìn khách quan và toàn diện về vấn đề lịch sử này", category: "hsk6", direction: "vi-zh" },
  { content: "这篇文章辞藻华丽，但缺乏深刻的思想内涵", category: "hsk6", direction: "zh-vi" },
  { content: "Khí hậu biến đổi thất thường gây ra những hậu quả khôn lường cho nông nghiệp", category: "hsk6", direction: "vi-zh" },
  { content: "保持谦虚谨慎的态度才能在职业道路上走得更远", category: "hsk6", direction: "zh-vi" },
  { content: "Việc bảo tồn đa dạng sinh học là nhiệm vụ cấp bách của toàn cầu", category: "hsk6", direction: "vi-zh" },
  { content: "这家企业的成功离不开其深厚的文化底蕴", category: "hsk6", direction: "zh-vi" },
  { content: "Cần phải cân nhắc kỹ lưỡng các yếu tố rủi ro trước khi triển khai dự án", category: "hsk6", direction: "vi-zh" },

  // ... (Tiếp tục thêm để đủ 100 câu)
  { content: "经济全球化使得各国之间的联系日益紧密", category: "business", direction: "zh-vi" },
  { content: "Tỷ lệ thất nghiệp ở giới trẻ đang là vấn đề nóng tại nhiều quốc gia", category: "social", direction: "vi-zh" },
  { content: "他总是准时参加会议，从来不迟到", category: "hsk4", direction: "zh-vi" },
  { content: "Lòng tin là nền tảng vững chắc nhất cho mọi mối quan hệ", category: "hsk5", direction: "vi-zh" },
  { content: "这种现象引起了社会各界的广泛关注和热议", category: "social", direction: "zh-vi" },
  { content: "Sự đổi mới sáng tạo là động lực cốt lõi của sự phát triển", category: "business", direction: "vi-zh" },
  { content: "即使遇到挫折，我们也绝不能轻言放弃", category: "hsk4", direction: "zh-vi" },
  { content: "Phân tích dữ liệu lớn giúp doanh nghiệp hiểu rõ hành vi người dùng", category: "business", direction: "vi-zh" },
  { content: "政府采取了一系列措施来稳定物价水平", category: "social", direction: "zh-vi" },
  { content: "Kỹ năng làm việc nhóm là yêu cầu cơ bản trong môi trường hiện đại", category: "hsk4", direction: "vi-zh" },
  { content: "我们要学会从不同的角度去思考问题", category: "hsk5", direction: "zh-vi" },
  { content: "Năng lượng tái tạo đang dần thay thế các nguồn năng lượng hóa thạch", category: "social", direction: "vi-zh" },
  { content: "这个理论在实际操作中具有很高的应用价值", category: "hsk6", direction: "zh-vi" },
  { content: "Việc ký kết hiệp định thương mại tự do mang lại nhiều cơ hội xuất khẩu", category: "business", direction: "vi-zh" },
  { content: "他用幽默的语言缓解了现场尴尬的气氛", category: "hsk5", direction: "zh-vi" },
  { content: "Sức khỏe tâm thần cần được quan tâm đúng mực như sức khỏe thể chất", category: "social", direction: "vi-zh" },
  { content: "这家公司的售后服务赢得了消费者的信赖", category: "hsk4", direction: "zh-vi" },
  { content: "Lạm phát tăng cao làm giảm sức mua của người dân", category: "business", direction: "vi-zh" },
  { content: "他那精彩的演说赢得了全场观众的热烈掌声", category: "hsk5", direction: "zh-vi" },
  { content: "Sự minh bạch trong quản lý tài chính là yếu tố sống còn của tổ chức", category: "business", direction: "vi-zh" },
  { content: "法律面前人人平等，谁也没有特权", category: "social", direction: "zh-vi" },
  { content: "Tôi rất mong đợi được hợp tác với quý công ty trong tương lai", category: "hsk4", direction: "vi-zh" },
  { content: "随着生活水平的提高，人们更加注重休闲娱乐", category: "hsk4", direction: "zh-vi" },
  { content: "Thị trường chứng khoán biến động mạnh do tác động của tin tức chính trị", category: "business", direction: "vi-zh" },
  { content: "教育的本质是启发智慧，而非仅仅灌输知识", category: "hsk6", direction: "zh-vi" },
  { content: "Mạng lưới giao thông công cộng cần được nâng cấp để giảm ùn tắc", category: "social", direction: "vi-zh" },
  { content: "虽然任务艰巨，但他依然充满信心", category: "hsk5", direction: "zh-vi" },
  { content: "Doanh nghiệp cần chú trọng vào việc đào tạo nguồn nhân lực chất lượng cao", category: "business", direction: "vi-zh" },
  { content: "我们要尊重每个人的隐私，不要随便打听别人的私事", category: "hsk4", direction: "zh-vi" },
  { content: "Du lịch bền vững đóng góp vào việc bảo vệ môi trường địa phương", category: "social", direction: "vi-zh" },
  { content: "他在工作中表现出色，很快就获得了提拔", category: "hsk5", direction: "zh-vi" },
  { content: "Dòng vốn đầu tư nước ngoài (FDI) tiếp tục đổ vào các khu công nghiệp", category: "business", direction: "vi-zh" },
  { content: "保持好奇心是不断进步的动力源泉", category: "hsk5", direction: "zh-vi" },
  { content: "Việc đọc sách giúp chúng ta mở rộng kiến thức và tầm nhìn", category: "hsk4", direction: "vi-zh" },
  { content: "城市的快节奏生活让人感到压力倍增", category: "social", direction: "zh-vi" },
  { content: "Chính sách thuế mới sẽ có hiệu lực vào đầu năm tới", category: "business", direction: "vi-zh" },
  { content: "他凭借顽强的毅力克服了重重困难", category: "hsk6", direction: "zh-vi" },
  { content: "Tình hữu nghị giữa hai nước đã trải qua nhiều thử thách lịch sử", category: "social", direction: "vi-zh" },
  { content: "这个消息在互联网上迅速传播开来", category: "hsk4", direction: "zh-vi" },
  { content: "Nâng cao năng suất lao động là chìa khóa để phát triển kinh tế", category: "business", direction: "vi-zh" },
  { content: "我们应该养成垃圾分类的好习惯", category: "social", direction: "zh-vi" },
  { content: "Anh ấy đã đỗ kỳ thi tiếng Trung cấp độ 6 với số điểm cao", category: "hsk6", direction: "vi-zh" },
  { content: "由于天气原因，航班被迫取消了", category: "hsk4", direction: "zh-vi" },
  { content: "Chương trình khuyến mãi này chỉ áp dụng cho khách hàng thành viên", category: "business", direction: "vi-zh" },
  { content: "人际关系的和谐对个人的心理健康至关重要", category: "hsk5", direction: "zh-vi" },
  { content: "Việc sử dụng túi nilon gây ô nhiễm môi trường nghiêm trọng", category: "social", direction: "vi-zh" },
  { content: "他这种舍己为人的精神值得我们每个人学习", category: "hsk6", direction: "zh-vi" },
  { content: "Công ty chúng tôi luôn đặt chất lượng sản phẩm lên hàng đầu", category: "business", direction: "vi-zh" },
  { content: "我们要根据实际情况制定合理的计划", category: "hsk4", direction: "zh-vi" },
  { content: "Giao tiếp phi ngôn ngữ đóng vai trò quan trọng trong diễn đạt", category: "hsk5", direction: "vi-zh" }
];

async function generateDataAndSeed() {
    console.log("🚀 Bắt đầu quá trình nạp dữ liệu...");

    for (const item of rawData) {
        try {
            console.log(`--- Đang xử lý câu: ${item.content} ---`);

            // Dùng AI để tách từ và dịch nghĩa tự động cho cấu trúc words
            const prompt = `
            Phân tích câu sau: "${item.content}"
            Hướng dịch: ${item.direction === 'zh-vi' ? 'Trung sang Việt' : 'Việt sang Trung'}.
            Nếu là tiếng Trung, hãy tách thành các từ/cụm từ. 
            Nếu là tiếng Việt, chỉ cần trả về mảng rỗng cho phần words.
            
            Trả về duy nhất JSON:
            {
                "words": [
                    {"w": "từ tiếng Trung", "p": "pinyin", "m": "nghĩa tiếng Việt"}
                ]
            }`;

            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" }
            });

            const aiData = JSON.parse(completion.choices[0].message.content);

            // Ghi vào Firestore
            await db.collection("questions").add({
                content: item.content,
                category: item.category,
                direction: item.direction,
                words: aiData.words || [],
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log("✅ Đã nạp thành công!");
        } catch (error) {
            console.error(`❌ Lỗi khi xử lý câu ${item.content}:`, error.message);
        }
    }
    console.log("        Hoàn tất toàn bộ dữ liệu!");
    process.exit();
}

generateDataAndSeed();