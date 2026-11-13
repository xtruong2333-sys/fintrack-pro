# SỔ THU CHI (EXPENSE TRACKER) - HƯỚNG DẪN SỬ DỤNG & XUẤT FILE .IPA

Ứng dụng quản lý tài chính cá nhân hoàn chỉnh được xây dựng bằng **React Native (Expo)** và **TypeScript**, giao diện tối ưu chuẩn **iOS Human Interface Guidelines**.

---

## 📱 PHẦN 1: CHẠY THỬ ỨNG DỤNG TRÊN IPHONE NGAY BÂY GIỜ

Bạn **không cần phải chờ xuất file .ipa** mới xem được app. Bạn có thể xem và tương tác với app trực tiếp ngay trên điện thoại:

1. Trên iPhone: Mở App Store, tải app **Expo Go** (Miễn phí).
2. Đảm bảo iPhone và máy tính kết nối **cùng một mạng Wi-Fi**.
3. Mở PowerShell hoặc Terminal tại thư mục `expense-tracker`, chạy lệnh:
   ```bash
   npx expo start
   ```
4. Trên màn hình máy tính sẽ hiện ra một **Mã QR Code**:
   * Mở ứng dụng **Camera** trên iPhone, quét mã QR.
   * Bấm vào thông báo mở bằng **Expo Go**.
5. Ứng dụng sẽ khởi chạy ngay lập tức trên iPhone của bạn! Mọi thay đổi trong code sẽ cập nhật tức thì (Fast Refresh).

---

## 🛠️ PHẦN 2: HƯỚNG DẪN XUẤT FILE .IPA CHO IOS

Expo cung cấp dịch vụ máy chủ đám mây chạy macOS (**EAS Build**) giúp người dùng Windows có thể xuất file `.ipa` mà không cần sở hữu máy Mac:

### Bước 1: Đăng ký tài khoản Expo
Nếu chưa có tài khoản, hãy đăng ký miễn phí tại: [https://expo.dev/signup](https://expo.dev/signup)

### Bước 2: Đăng nhập vào EAS từ Terminal
Chạy lệnh sau tại thư mục `expense-tracker`:
```bash
npx eas-cli login
```
*Nhập email / username và mật khẩu bạn vừa tạo.*

### Bước 3: Liên kết dự án
```bash
npx eas-cli project:init
```

### Bước 4: Chạy lệnh đóng gói xuất file .IPA
```bash
npx eas-cli build -p ios --profile preview
```
* **Quá trình diễn ra:**
  1. EAS CLI sẽ hỏi bạn về tài khoản Apple ID để cấu hình chứng chỉ ký (Code Signing).
  2. Mã nguồn được nén và gửi lên máy chủ đám mây của Expo.
  3. Máy chủ macOS của Expo sẽ biên dịch và đóng gói thành file `.ipa`.
  4. Sau khi hoàn thành, màn hình sẽ hiển thị đường link tải trực tiếp file `.ipa` hoặc bạn có thể quét mã QR để tải về iPhone.

---

## 📲 PHẦN 3: CÀI FILE .IPA VÀO IPHONE BẰNG SIDELOADLY

Sau khi tải file `.ipa` về máy tính:

1. Tải và cài đặt phần mềm **Sideloadly** trên Windows: [https://sideloadly.io/](https://sideloadly.io/)
2. Dùng cáp sạc nối iPhone với máy tính (chọn *Tin cậy máy tính này / Trust this computer* trên iPhone nếu được hỏi).
3. Mở **Sideloadly**:
   * Kéo thả file `.ipa` của bạn vào ô ứng dụng trong Sideloadly.
   * Nhập Apple ID của bạn.
   * Bấm nút **Start**.
4. Chờ 1-2 phút cho Sideloadly cài app lên iPhone.
5. Sau khi cài xong, trên iPhone vào: **Cài đặt (Settings) > Cài đặt chung (General) > Quản lý VPN & Thiết bị (VPN & Device Management)** > Chọn Apple ID của bạn và bấm **Tin cậy (Trust)**.
6. Mở app **Sổ Thu Chi** và tận hưởng!

---

## ✨ CÁC TÍNH NĂNG ĐÃ HOÀN THIỆN TRONG ỨNG DỤNG:
* 💰 **Dashboard trực quan:** Thẻ số dư gradient sang trọng, tổng thu, tổng chi.
* 🎯 **Hạn mức chi tiêu tháng (Budget):** Cảnh báo màu sắc theo % chi tiêu thực tế.
* 📝 **Giao dịch chi tiết:** Đầy đủ các danh mục Ăn uống, Mua sắm, Di chuyển, Hóa đơn, Tiền lương, Thưởng... có kèm Icon và Màu sắc sinh động.
* ➕ **Bàn phím nhập số tiền thông minh:** Nút thêm nhanh +50k, +100k, +200k, +500k, định dạng tiền tệ VNĐ chuẩn.
* 📊 **Biểu đồ hình tròn SVG (Donut Chart):** Phân tích % chi tiêu theo từng nhóm danh mục.
* 🔍 **Tìm kiếm & Bộ lọc:** Lọc theo khoản thu/chi, tìm theo ghi chú giao dịch.
* 📳 **Phản hồi rung chân thực (Haptics):** Đem lại trải nghiệm cảm giác tự nhiên như ứng dụng gốc của Apple.
* 💾 **Lưu trữ dữ liệu Offline:** Dùng AsyncStorage, dữ liệu lưu vĩnh viễn trên thiết bị.
