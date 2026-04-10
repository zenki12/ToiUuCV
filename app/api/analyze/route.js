import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

const ANALYSIS_PROMPT = `Bạn là chuyên gia tư vấn nghề nghiệp hàng đầu Việt Nam với hơn 15 năm kinh nghiệm review CV. 
Phân tích CV dưới đây so với mô tả công việc (JD) và trả về kết quả phân tích dưới dạng JSON.

CV:
---
{CV_TEXT}
---

Mô tả công việc (JD):
---
{JD_TEXT}
---

Trả về JSON với cấu trúc CHÍNH XÁC sau (không thêm markdown, không thêm code block, chỉ JSON thuần):
{
  "candidateName": "Tên ứng viên (lấy từ CV)",
  "overallScore": <số từ 0-100>,
  "recommendation": "NÊN ỨNG TUYỂN" | "CẦN CÂN NHẮC" | "KHÔNG NÊN",
  "recommendationDetail": "Giải thích chi tiết lý do khuyến nghị, 2-3 câu",
  "cvStrategy": {
    "summary": "Đoạn nhận xét tổng quan chiến lược CV, 3-4 câu chi tiết",
    "shouldDo": "Gợi ý cụ thể nên làm, 2-3 câu",
    "shouldNotDo": "Gợi ý cụ thể không nên làm, 2-3 câu"
  },
  "metrics": [
    {"name": "Mức độ phù hợp", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Hiệu quả tóm tắt", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Kinh nghiệm", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Kỹ năng kỹ thuật", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Học vấn", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Từ khóa ATS", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Thành tích", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Kỹ năng mềm", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Ngôn ngữ", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Tổng thể", "score": <0-100>, "comment": "nhận xét ngắn"}
  ],
  "layout": {
    "score": <0-100>,
    "summary": "Nhận xét về bố cục và trình bày, 2-3 câu",
    "tips": [
      "Gợi ý cải thiện bố cục 1",
      "Gợi ý cải thiện bố cục 2",
      "Gợi ý cải thiện bố cục 3"
    ]
  },
  "deepAnalysis": [
    {
      "sectionName": "KINH NGHIỆM LÀM VIỆC",
      "sectionIcon": "💼",
      "subtitle": "(Tên vị trí cụ thể)",
      "score": <0-100>,
      "status": "ƯU TIÊN: RẤT CAO" (< 30) | "ƯU TIÊN: CAO" (31-49) | "ƯU TIÊN: TRUNG BÌNH" (50-79) | "TỐT" (80-89) | "RẤT TỐT" (90-100),
      "statusColor": "red" (< 50) | "yellow" (50-79) | "green" (>= 80),
      "issueDetection": "Mô tả vấn đề phát hiện được trong phần này của CV, 2-3 câu chi tiết",
      "coachAdvice": "Lời khuyên coach chuyên nghiệp dạng trích dẫn, 1-2 câu",
      "actionSteps": ["Bước hành động 1", "Bước hành động 2", "Bước hành động 3"],
      "rewriteSample": {
        "currentText": "Trích dẫn nguyên văn từ CV hiện tại cần cải thiện",
        "currentLabel": "HIỆN TẠI",
        "improvedText": "Bản viết lại chuyên sâu, chi tiết và ấn tượng hơn nhiều",
        "improvedLabel": "GỢI Ý CẢI THIỆN",
        "expertTip": "Lời khuyên chuyên gia ngắn gọn về cách cải thiện phần này"
      }
    },
    {
      "sectionName": "KỸ NĂNG (CÔNG NGHỆ)",
      "sectionIcon": "⚡",
      "subtitle": "",
      "score": <0-100>,
      "status": "ƯU TIÊN: RẤT CAO" (< 30) | "ƯU TIÊN: CAO" (31-49) | "ƯU TIÊN: TRUNG BÌNH" (50-79) | "TỐT" (80-89) | "RẤT TỐT" (90-100),
      "statusColor": "red" (< 50) | "yellow" (50-79) | "green" (>= 80),
      "issueDetection": "Vấn đề phát hiện trong phần kỹ năng",
      "coachAdvice": "Lời khuyên coach",
      "actionSteps": ["Bước 1", "Bước 2", "Bước 3"],
      "rewriteSample": {
        "currentText": "Kỹ năng hiện tại liệt kê trong CV",
        "currentLabel": "HIỆN TẠI",
        "improvedText": "Cách trình bày kỹ năng tốt hơn",
        "improvedLabel": "GỢI Ý CẢI THIỆN",
        "expertTip": "Tip chuyên gia"
      }
    },
    {
      "sectionName": "TÓM TẮT GIỚI THIỆU",
      "sectionIcon": "📝",
      "subtitle": "",
      "score": <0-100>,
      "status": "ƯU TIÊN: RẤT CAO" (< 30) | "ƯU TIÊN: CAO" (31-49) | "ƯU TIÊN: TRUNG BÌNH" (50-79) | "TỐT" (80-89) | "RẤT TỐT" (90-100),
      "statusColor": "red" (< 50) | "yellow" (50-79) | "green" (>= 80),
      "issueDetection": "Vấn đề phát hiện trong phần tóm tắt",
      "coachAdvice": "Lời khuyên",
      "actionSteps": ["Bước 1", "Bước 2"],
      "rewriteSample": {
        "currentText": "Tóm tắt hiện tại",
        "currentLabel": "HIỆN TẠI",
        "improvedText": "Tóm tắt cải thiện",
        "improvedLabel": "GỢI Ý CẢI THIỆN",
        "expertTip": "Tip"
      }
    },
    {
      "sectionName": "HÀNH CHÍNH & QUẢN LÝ",
      "sectionIcon": "📋",
      "subtitle": "",
      "score": <0-100>,
      "status": "ƯU TIÊN: RẤT CAO" (< 30) | "ƯU TIÊN: CAO" (31-49) | "ƯU TIÊN: TRUNG BÌNH" (50-79) | "TỐT" (80-89) | "RẤT TỐT" (90-100),
      "statusColor": "red" (< 50) | "yellow" (50-79) | "green" (>= 80),
      "issueDetection": "Vấn đề phát hiện",
      "coachAdvice": "Lời khuyên",
      "actionSteps": ["Bước 1", "Bước 2"],
      "rewriteSample": {
        "currentText": "Nội dung hiện tại",
        "currentLabel": "HIỆN TẠI",
        "improvedText": "Nội dung cải thiện",
        "improvedLabel": "GỢI Ý CẢI THIỆN",
        "expertTip": "Tip"
      }
    },
    {
      "sectionName": "GIAO TIẾP & KẾT NỐI",
      "sectionIcon": "🤝",
      "subtitle": "",
      "score": <0-100>,
      "status": "ƯU TIÊN: RẤT CAO" (< 30) | "ƯU TIÊN: CAO" (31-49) | "ƯU TIÊN: TRUNG BÌNH" (50-79) | "TỐT" (80-89) | "RẤT TỐT" (90-100),
      "statusColor": "red" (< 50) | "yellow" (50-79) | "green" (>= 80),
      "issueDetection": "Vấn đề phát hiện",
      "coachAdvice": "Lời khuyên",
      "actionSteps": ["Bước 1", "Bước 2"],
      "rewriteSample": {
        "currentText": "Nội dung hiện tại",
        "currentLabel": "HIỆN TẠI",
        "improvedText": "Nội dung cải thiện",
        "improvedLabel": "GỢI Ý CẢI THIỆN",
        "expertTip": "Tip"
      }
    }
  ]
}

LƯU Ý QUAN TRỌNG:
- deepAnalysis phải có TỐI THIỂU 5 phần phân tích chuyên sâu
- Mỗi phần phải có đầy đủ: issueDetection, coachAdvice, actionSteps, rewriteSample
- rewriteSample.improvedText phải là bản viết lại CHI TIẾT và CHUYÊN NGHIỆP, dài hơn bản gốc
- Hãy phân tích dựa trên CV và JD thực tế được cung cấp
- Tất cả nội dung phải bằng tiếng Việt`;

async function extractTextFromPDF(buffer) {
    try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        return data.text;
    } catch (err) {
        console.error('PDF parse error:', err);
        return '';
    }
}

async function extractTextFromDOCX(buffer) {
    try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (err) {
        console.error('DOCX parse error:', err);
        return '';
    }
}

// Removed getMockResult to prevent UI confusion when AI fails
export async function POST(request) {
    try {
        const formData = await request.formData();
        const cvFile = formData.get('cv');
        const jdText = formData.get('jd');

        if (!cvFile || !jdText) {
            return NextResponse.json(
                { error: 'Vui lòng cung cấp đầy đủ CV và mô tả công việc.' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await cvFile.arrayBuffer());
        const fileName = cvFile.name.toLowerCase();

        let cvText = '';
        if (fileName.endsWith('.pdf')) {
            cvText = await extractTextFromPDF(buffer);
        } else if (fileName.endsWith('.docx')) {
            cvText = await extractTextFromDOCX(buffer);
        } else {
            return NextResponse.json(
                { error: 'Định dạng file không được hỗ trợ. Vui lòng sử dụng PDF hoặc DOCX.' },
                { status: 400 }
            );
        }

        if (!cvText.trim()) {
            cvText = `[Không thể trích xuất text từ file: ${cvFile.name}]`;
        }


        if (!genAI) {
            console.error('No GEMINI_API_KEY found');
            return NextResponse.json(
                { error: 'Hệ thống chưa được cấu hình GEMINI_API_KEY. Vui lòng thêm vào file .env' },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = ANALYSIS_PROMPT
            .replace('{CV_TEXT}', cvText.substring(0, 8000))
            .replace('{JD_TEXT}', jdText.substring(0, 4000));

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let cleanJson = responseText.trim();
        if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        const analysisResult = JSON.parse(cleanJson);
        return NextResponse.json(analysisResult);

    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: 'Có lỗi xảy ra trong quá trình phân tích CV: ' + error.message },
            { status: 500 }
        );
    }
}
