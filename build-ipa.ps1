Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "     XUẤT FILE .IPA CHO IPHONE (EXPO EAS CLOUD BUILD)   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dự án: FinTrack Pro (Sổ Thu Chi Cá Nhân)" -ForegroundColor Gray
Write-Host "Nền tảng: iOS (.ipa)" -ForegroundColor Gray
Write-Host ""

if ($PSScriptRoot) {
    Set-Location -Path $PSScriptRoot
}

Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "[BƯỚC 1/2] Đang kết nối tới máy chủ Expo EAS..." -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "(Lần đầu tiên tải công cụ EAS CLI có thể mất khoảng 15-30 giây, vui lòng đợi một chút...)" -ForegroundColor Gray
Write-Host ""

$user = & npx --yes eas-cli whoami 2>&1
if ($LASTEXITCODE -ne 0 -or $user -match "Not logged in" -or $user -match "Authentication") {
    Write-Host "⚠️  Bạn chưa đăng nhập Expo CLI!" -ForegroundColor Red
    Write-Host "Nếu chưa có tài khoản, hãy đăng ký miễn phí tại: https://expo.dev/signup" -ForegroundColor Cyan
    Write-Host "Đang mở màn hình đăng nhập, vui lòng nhập Email/Username và Mật khẩu Expo của bạn..." -ForegroundColor Yellow
    Write-Host ""
    & npx --yes eas-cli login
} else {
    Write-Host "✅ Đã đăng nhập tài khoản: $user" -ForegroundColor Green
}

Write-Host ""
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "[BƯỚC 2/2] Bắt đầu đóng gói và xuất file .IPA trên Cloud..." -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "Mã nguồn đang được nén và gửi lên máy chủ macOS của Expo để biên dịch..." -ForegroundColor Gray
Write-Host ""

& npx --yes eas-cli build -p ios --profile preview

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "🎉 HOÀN TẤT BIÊN DỊCH!" -ForegroundColor Green
Write-Host "Hãy tải file .ipa theo đường link hiển thị ở trên về máy tính." -ForegroundColor Cyan
Write-Host "Sau đó dùng Sideloadly (https://sideloadly.io) để cài vào iPhone." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Read-Host -Prompt "Nhấn Enter để đóng cửa sổ"
