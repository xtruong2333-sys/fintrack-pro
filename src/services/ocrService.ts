import { Platform } from 'react-native';

export interface CandidateAmount {
  amount: number;
  label: string;
  score: number;
  lineText: string;
}

export interface OCRResult {
  success: boolean;
  rawText: string;
  totalAmount: number;
  detectedAmounts: number[];
  candidates: CandidateAmount[];
  suggestedNote: string;
  suggestedCategoryId: string;
  suggestedType?: 'expense' | 'income';
  suggestedWalletId?: 'bank' | 'cash' | 'ewallet';
  suggestedDate?: string;
  errorMessage?: string;
}

const OCR_API_KEYS = ['K87899142388957', 'helloworld'];

function cleanMoneyString(str: string): number {
  let cleaned = str.replace(/(?<=\d)[oO]/g, '0').replace(/[oO](?=\d)/g, '0');
  cleaned = cleaned.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10);
}

export const OCRService = {
  /**
   * Quét và trích xuất chữ thực tế từ ảnh hóa đơn & biên lai chuyển khoản ngân hàng
   */
  async scanReceipt(imageUri: string, base64Data?: string): Promise<OCRResult> {
    let extractedText = '';

    // 1. Thử gọi API OCR.space với ngôn ngữ Tiếng Việt (engine 2 tối ưu cho số và bảng)
    extractedText = await this.callOCRSpace(imageUri, base64Data);

    // 2. Nếu trên Web và API không có kết quả, thử Tesseract.js chạy trong trình duyệt
    if (!extractedText.trim() && Platform.OS === 'web') {
      try {
        // @ts-ignore
        const Tesseract = await import('tesseract.js');
        const res = await Tesseract.recognize(imageUri, 'eng', {
          logger: () => {},
        });
        extractedText = res.data?.text || '';
      } catch (err) {
        console.warn('Tesseract web fallback failed:', err);
      }
    }

    if (!extractedText.trim()) {
      return {
        success: false,
        rawText: '',
        totalAmount: 0,
        detectedAmounts: [],
        candidates: [],
        suggestedNote: '',
        suggestedCategoryId: 'food',
        errorMessage: 'Không thể nhận diện văn bản từ ảnh hóa đơn.',
      };
    }

    // 3. Phân tích văn bản OCR để trích xuất số tiền, người nhận, ngày và danh mục
    return this.parseReceiptText(extractedText);
  },

  /**
   * Gọi OCR.space API với dự phòng nhiều API key và Engine
   */
  async callOCRSpace(imageUri: string, base64Data?: string): Promise<string> {
    let base64Payload = '';
    if (base64Data) {
      base64Payload = base64Data.startsWith('data:')
        ? base64Data
        : `data:image/jpeg;base64,${base64Data}`;
    } else if (imageUri.startsWith('data:')) {
      base64Payload = imageUri;
    }

    for (const apiKey of OCR_API_KEYS) {
      try {
        const formData = new FormData();
        formData.append('apikey', apiKey);
        formData.append('language', 'vie'); // Nhận diện tiếng Việt
        formData.append('isOverlayRequired', 'false');
        formData.append('detectOrientation', 'true');
        formData.append('scale', 'true');
        formData.append('OCREngine', '2'); // Engine 2 tối ưu cho số và hóa đơn / biên lai

        if (base64Payload) {
          formData.append('base64Image', base64Payload);
        } else {
          // @ts-ignore
          formData.append('file', {
            uri: imageUri,
            name: 'receipt.jpg',
            type: 'image/jpeg',
          });
        }

        const response = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          continue;
        }

        const json = await response.json();
        if (json.ParsedResults && json.ParsedResults.length > 0) {
          const text = json.ParsedResults[0].ParsedText || '';
          if (text.trim()) {
            return text;
          }
        }
      } catch (e) {
        console.warn(`OCR.space API key ${apiKey} error:`, e);
      }
    }

    return '';
  },

  /**
   * Thuật toán phân tích nội dung hóa đơn giấy & biên lai chuyển khoản ngân hàng Việt Nam
   */
  parseReceiptText(text: string): OCRResult {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Nhận diện loại hóa đơn: Biên lai chuyển khoản ngân hàng (Techcombank, BIDV, VCB, MB...)
    const isBankTransfer =
      /chuyển\s*thành\s*công|chuyen\s*thanh\s*cong|giao\s*dịch\s*thành\s*công|giao\s*dich\s*thanh\s*cong|chuyển\s*tiền|chuyen\s*tien|biên\s*lai|bien\s*lai|tài\s*khoản\s*nhận|tai\s*khoan\s*nhan|ngân\s*hàng|ngan\s*hang|napas/i.test(
        text
      );

    const isIncomeTransfer =
      /nhận\s*tiền\s*thành\s*công|tiền\s*vào|\+\s*[\d.,]+\s*vnd|\+\s*vnd/i.test(text);

    const PRIORITY_KEYWORDS = [
      {
        regex:
          /tổng\s*tiền\s*thanh\s*toán|tong\s*tien\s*thanh\s*toan|tổng\s*cộng\s*thanh\s*toán|tong\s*cong\s*thanh\s*toan/i,
        score: 100,
        label: 'Tổng thanh toán',
      },
      {
        regex: /vnd\s*[\d.,]+|[\d.,]+\s*vnd|[\d.,]+\s*vnđ|[\d.,]+\s*đ/i,
        score: 98,
        label: 'Số tiền',
      },
      {
        regex:
          /tổng\s*cộng|tong\s*cong|tổng\s*tiền|tong\s*tien|grand\s*total|total\s*due|tổng\s*tc|tong\s*tc/i,
        score: 90,
        label: 'Tổng cộng',
      },
      {
        regex:
          /thành\s*tiền|thanh\s*tien|phải\s*trả|phai\s*tra|khách\s*phải\s*trả|tiền\s*thanh\s*toán/i,
        score: 85,
        label: 'Thành tiền',
      },
      {
        regex: /chuyển\s*khoản|chuyen\s*khoan|thanh\s*toán|thanh\s*toan|total/i,
        score: 75,
        label: 'Thanh toán',
      },
      {
        regex: /tạm\s*tính|tam\s*tinh|tiền\s*hàng|tien\s*hang|cộng\s*tiền\s*hàng|subtotal/i,
        score: 50,
        label: 'Tạm tính',
      },
    ];

    const NEGATIVE_KEYWORDS = [
      /tiền\s*khách\s*đưa|khach\s*dua|tiền\s*đưa|cash\s*tendered/i,
      /tiền\s*thừa|tiền\s*trả\s*lại|tra\s*lai|tien\s*thua|change/i,
      /giảm\s*giá|giam\s*gia|chiết\s*khấu|voucher|discount/i,
      /mã\s*số\s*thuế|mst|tax\s*code|sđt|tel|hotline|phone/i,
      /ngày\s*thực\s*hiện|ngay\s*thuc\s*hien|thời\s*gian|thoi\s*gian|thg\s*\d+|lúc\s*\d+/i,
      /ngày|date|giờ|time/i,
      /mã\s*giao\s*dịch|ma\s*giao\s*dich|mã\s*gd|ft\d+|ref\s*#|trace/i,
      /tài\s*khoản\s*nhận|tai\s*khoan\s*nhan|số\s*tài\s*khoản|so\s*tai\s*khoan|stk|số\s*thẻ|so\s*the/i,
      /ngân\s*hàng\s*tmcp|ngân\s*hàng|bank/i,
      /số\s*hđ|so\s*hd|hóa\s*đơn\s*số|order\s*#|bàn|ban/i,
    ];

    // Regex tìm số tiền: 900,000, 150.000, 150000, 150k, 1.250.000
    const moneyPattern =
      /(?:(?:\d{1,3}[.,]\d{3})+(?:[.,]\d{2,3})?|\d{4,}(?:\s*(?:vn[dđ]|đồng|đ))?|\d+k)/gi;

    const candidates: CandidateAmount[] = [];
    let skipNextAccountLine = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Đánh dấu bỏ qua số tài khoản nếu dòng trước là 'tài khoản nhận'
      if (/tài\s*khoản\s*nhận|tài\s*khoản\s*nguồn|số\s*tài\s*khoản|stk/i.test(line)) {
        skipNextAccountLine = true;
        continue;
      }
      if (skipNextAccountLine && /^\s*[\d\s-]{6,25}\s*$/.test(line)) {
        skipNextAccountLine = false;
        continue;
      }

      // Bỏ qua định dạng số tài khoản ngân hàng (VD: 8823 7776 88)
      if (/^\s*\d{3,6}(?:\s+\d{2,6}){1,4}\s*$/.test(line)) {
        continue;
      }
      // Bỏ qua mã giao dịch ngân hàng (VD: FT26313857265292)
      if (/^[A-Za-z]{1,4}\d{8,25}$/.test(line)) {
        continue;
      }

      // Bỏ qua dòng có từ khóa loại trừ
      const isNegative = NEGATIVE_KEYWORDS.some((rx) => rx.test(line));
      if (isNegative) continue;

      // Tính điểm ưu tiên theo từ khóa
      let matchedScore = 10;
      let matchedLabel = 'Chi phí';
      for (const pk of PRIORITY_KEYWORDS) {
        if (pk.regex.test(line)) {
          matchedScore = pk.score;
          matchedLabel = pk.label;
          break;
        }
      }

      // Với biên lai chuyển khoản ngân hàng, dòng tiền ở 4 dòng đầu nhận điểm ưu tiên cao nhất
      if (isBankTransfer && i <= 3 && /vnd|vnđ|[\d.,]{5,}/i.test(line)) {
        matchedScore = Math.max(matchedScore, 110);
        matchedLabel = 'Tiền chuyển';
      }

      // Chuẩn hóa lỗi OCR: O/o -> 0, S -> 5, l/I -> 1
      const normalizedLine = line.replace(/([0-9][0-9.,oOlIsS]*)/gi, (match) => {
        if (/[.,]/.test(match) || /^\d+[oOlI]+$/i.test(match)) {
          return match
            .replace(/[oOD]/gi, '0')
            .replace(/[lI]/g, '1')
            .replace(/[sS]/g, '5');
        }
        return match;
      });

      const matches = normalizedLine.match(moneyPattern);
      if (matches) {
        for (const m of matches) {
          let val = 0;
          if (/k$/i.test(m)) {
            val = parseInt(m.replace(/k/i, ''), 10) * 1000;
          } else {
            val = cleanMoneyString(m);
          }

          // Bộ lọc hợp lệ: >= 1.000 đ và <= 500 triệu đ, loại trừ các năm 2024..2027
          if (
            val >= 1000 &&
            val <= 500000000 &&
            val !== 2024 &&
            val !== 2025 &&
            val !== 2026 &&
            val !== 2027
          ) {
            candidates.push({
              amount: val,
              score: matchedScore,
              label: matchedLabel,
              lineText: line,
            });
          }
        }
      }
    }

    // Sắp xếp các ứng viên theo độ tin cậy
    candidates.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.amount - a.amount;
    });

    // Lọc trùng số tiền
    const uniqueCandidates: CandidateAmount[] = [];
    const seen = new Set<number>();
    for (const c of candidates) {
      if (!seen.has(c.amount)) {
        seen.add(c.amount);
        uniqueCandidates.push(c);
      }
    }

    const primaryTotal = uniqueCandidates.length > 0 ? uniqueCandidates[0].amount : 0;
    const detectedAmounts = uniqueCandidates.slice(0, 5).map((c) => c.amount);

    // Trích xuất ngày giao dịch nếu có
    let suggestedDate: string | undefined = undefined;
    const dateMatch = text.match(
      /(\d{1,2})\s*(?:thg|tháng|\/|-)\s*(\d{1,2})(?:,|\/|-|\s)*(\d{4})/i
    );
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, '0');
      const month = dateMatch[2].padStart(2, '0');
      const year = dateMatch[3];
      suggestedDate = `${year}-${month}-${day}`;
    }

    let suggestedCategoryId = 'food';
    let suggestedNote = 'Hóa đơn thanh toán';
    let suggestedType: 'expense' | 'income' = isIncomeTransfer ? 'income' : 'expense';
    let suggestedWalletId: 'bank' | 'cash' | 'ewallet' = isBankTransfer ? 'bank' : 'cash';

    if (isBankTransfer) {
      let recipient = '';
      let message = '';

      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        const matchTo =
          l.match(/^tới\s+(.+)$/i) ||
          l.match(/^người\s*nhận:\s*(.+)$/i) ||
          l.match(/^đến:\s*(.+)$/i);
        if (matchTo) {
          recipient = matchTo[1].trim();
        }
        if (/lời\s*nhắn|nội\s*dung|nd\s*chuyển/i.test(l) && i + 1 < lines.length) {
          message = lines[i + 1].trim();
        }
      }

      if (recipient && message) {
        suggestedNote = `Chuyển tới ${recipient}: ${message}`;
      } else if (recipient) {
        suggestedNote = `Chuyển tiền tới ${recipient}`;
      } else if (message) {
        suggestedNote = `Chuyển tiền: ${message}`;
      } else {
        suggestedNote = 'Chuyển khoản thành công';
      }

      // Phân loại danh mục theo lời nhắn
      const msgLower = ` ${message} `.toLowerCase();
      if (
        /\b(ăn|cơm|com|uống|uong|cafe|cà phê|trà sữa|tra sua|bún|phở|lẩu|lau|nướng|bbq|bánh|pizza)\b/i.test(
          msgLower
        ) ||
        /\ban\b/i.test(msgLower)
      ) {
        suggestedCategoryId = 'food';
      } else if (
        /\b(mua|shop|đơn hàng|don hang|quần|áo|giày|túi|shopee|lazada|tiktok)\b/i.test(msgLower)
      ) {
        suggestedCategoryId = 'shopping';
      } else if (
        /\b(tiền phòng|tiền nhà|dien|điện|nước|nuoc|wifi|mạng|mang|internet|phí|hoc phi|học phí)\b/i.test(
          msgLower
        )
      ) {
        suggestedCategoryId = 'bills';
      } else if (/\b(xăng|xang|xe|grab|be|taxi|vé|ve)\b/i.test(msgLower)) {
        suggestedCategoryId = 'transport';
      } else {
        suggestedCategoryId = 'bills'; // Mặc định hóa đơn / dịch vụ chuyển khoản
      }
    } else {
      // Hóa đơn giấy bán lẻ thông thường
      const topText = lines.slice(0, 5).join(' ').toLowerCase();
      if (
        /highlands|phúc long|phuc long|starbucks|coffee|cà phê|cafe|katinat|phê la|trà sữa|tra sua|mixue/i.test(
          topText
        )
      ) {
        suggestedCategoryId = 'food';
        suggestedNote = 'Cà phê & Đồ uống';
      } else if (
        /manwah|haidilao|kichi|gogi|bbq|nhà hàng|nha hang|quán ăn|quan an|cơm|phở|lẩu|pizza|kfc|lotteria|jollibee/i.test(
          topText
        )
      ) {
        suggestedCategoryId = 'food';
        suggestedNote = 'Ăn uống nhà hàng';
      } else if (
        /winmart|circle k|coopmart|co\.op|bách hóa|bach hoa|siêu thị|sieu thi|aeon|mega market|gs25|7-eleven/i.test(
          topText
        )
      ) {
        suggestedCategoryId = 'shopping';
        suggestedNote = 'Mua sắm siêu thị';
      } else if (/petrolimex|pv oil|xăng|xang|grab|be|gojek|taxi|xanh sm/i.test(topText)) {
        suggestedCategoryId = 'transport';
        suggestedNote = 'Di chuyển & Xăng xe';
      } else if (
        /pharmacity|long châu|long chau|nhà thuốc|nha thuoc|an khang|bệnh viện|phòng khám/i.test(
          topText
        )
      ) {
        suggestedCategoryId = 'health';
        suggestedNote = 'Thuốc men & Y tế';
      } else if (/evn|điện lực|dien luc|fpt|viettel|vnpt|nước/i.test(topText)) {
        suggestedCategoryId = 'bills';
        suggestedNote = 'Hóa đơn sinh hoạt';
      } else if (lines.length > 0 && lines[0].length <= 35) {
        suggestedNote = `Hóa đơn: ${lines[0]}`;
      }
    }

    return {
      success: primaryTotal > 0,
      rawText: text,
      totalAmount: primaryTotal,
      detectedAmounts,
      candidates: uniqueCandidates.slice(0, 5),
      suggestedNote,
      suggestedCategoryId,
      suggestedType,
      suggestedWalletId,
      suggestedDate,
    };
  },
};
