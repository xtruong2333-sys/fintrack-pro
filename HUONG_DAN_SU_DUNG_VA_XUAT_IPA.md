# FINTRACK PRO - HƯỚNG DẪN XUẤT FILE .IPA & CÀI ĐẶT TRÊN IPHONE

Dự án ứng dụng quản lý tài chính **FinTrack Pro** đã được cấu hình hoàn chỉnh các chứng chỉ, quyền hạn iOS (Camera & Photo Library) và kịch bản xuất file `.ipa`.

---

## 🚀 CÁCH 1: XUẤT FILE .IPA BẰNG 1-CLICK (KHUYẾN NGHỊ TRÊN WINDOWS)

Tôi đã tạo sẵn file tự động [build-ipa.bat](file:///d:/New%20folder/expense-tracker/build-ipa.bat) trong thư mục dự án.

### Các bước thực hiện:
1. Mở thư mục `D:\New folder\expense-tracker`.
2. **Nhấp đúp chuột vào file `build-ipa.bat`** (hoặc mở PowerShell/CMD gõ `.\build-ipa.bat`).
3. Cửa sổ màu xanh hiện lên:
   * Nếu chưa đăng nhập Expo, hệ thống sẽ yêu cầu bạn nhập tài khoản Expo (đăng ký miễn phí tại [https://expo.dev/signup](https://expo.dev/signup)).
   * Hệ thống sẽ tự động nén code và gửi lên máy chủ macOS của Expo để biên dịch thành file `.ipa`.
4. Sau khi biên dịch xong (~5-7 phút), màn hình sẽ hiện link tải trực tiếp file `.ipa`.
5. Bạn tải file `.ipa` về máy tính.

---

## ☁️ CÁCH 2: XUẤT .IPA TỰ ĐỘNG BẰNG GITHUB ACTIONS (HOÀN TOÀN MIỄN PHÍ)

Tôi đã tạo sẵn file kịch bản CI/CD [build-ipa-free.yml](file:///d:/New%20folder/expense-tracker/.github/workflows/build-ipa-free.yml).

1. Đẩy mã nguồn dự án lên kho GitHub của bạn (Public hoặc Private).
2. Vào tab **Actions** trên GitHub > Chọn workflow **Build iOS IPA (Free macOS Runner)** > Bấm **Run workflow**.
3. Máy chủ macOS miễn phí của GitHub sẽ tự động biên dịch và tạo file **FinTrackPro.ipa**.
4. Bạn chỉ cần vào mục **Artifacts** tải file `.ipa` về máy tính.

---

## 📲 CÁCH CÀI FILE .IPA VÀO IPHONE BẰNG SIDELOADLY

Sau khi có file `.ipa`:
1. Tải phần mềm **Sideloadly** trên Windows: [https://sideloadly.io/](https://sideloadly.io/)
2. Cắm cáp kết nối iPhone với máy tính (chọn *Tin cậy máy tính này / Trust* trên màn hình iPhone).
3. Mở **Sideloadly**:
   * Kéo file `.ipa` vừa tải vào ô biểu tượng app trong Sideloadly.
   * Nhập Apple ID của bạn (Sideloadly dùng tài khoản Apple miễn phí của bạn để ký chứng chỉ).
   * Bấm nút **Start**.
4. Chờ 1-2 phút, icon **Sổ Thu Chi (FinTrack Pro)** sẽ xuất hiện trên màn hình chính của iPhone!
5. Trên iPhone vào: **Cài đặt > Cài đặt chung > Quản lý VPN & Thiết bị** > Bấm **Tin cậy (Trust)** Apple ID của bạn.
6. Mở ứng dụng và sử dụng bình thường!

---

## ⚡ CÁCH 3: TRẢI NGHIỆM NGAY TỨC THÌ QUA EXPO GO (KHÔNG CẦN CHỜ XUẤT .IPA)

Nếu bạn muốn mở app trải nghiệm ngay trên iPhone mà không phải chờ 5-10 phút máy chủ biên dịch:
1. Mở App Store trên iPhone, tải app **Expo Go** (Miễn phí).
2. Đảm bảo iPhone và máy tính kết nối **cùng một mạng Wi-Fi**.
3. Trong thư mục `expense-tracker`, chạy lệnh:
   ```bash
   npx expo start
   ```
4. Bật Camera iPhone, quét mã QR trên màn hình máy tính $\rightarrow$ Ứng dụng sẽ bung lên iPhone chạy mượt mà 120Hz ngay lập tức!
