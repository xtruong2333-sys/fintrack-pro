@echo off
chcp 65001 >nul
title Xuất File .IPA Cho iPhone - FinTrack Pro
color 0b

echo ====================================================================
echo        XUẤT FILE .IPA CHO IPHONE (EXPO EAS CLOUD BUILD)
echo ====================================================================
echo.
echo Dự án: FinTrack Pro (Sổ Thu Chi Cá Nhân)
echo Nền tảng: iOS (.ipa)
echo Máy chủ biên dịch: Apple macOS Silicon (Expo Cloud)
echo.

cd /d "%~dp0"

echo --------------------------------------------------------------------
echo [BƯỚC 1/3] Kiểm tra tài khoản Expo...
echo --------------------------------------------------------------------
call npx eas-cli whoami
if %errorlevel% neq 0 (
    echo.
    echo ⚠️ Bạn chưa đăng nhập tài khoản Expo!
    echo Nếu chưa có tài khoản, hãy đăng ký MIỄN PHÍ tại: https://expo.dev/signup
    echo.
    echo Đang mở màn hình đăng nhập...
    call npx eas-cli login
)

echo.
echo --------------------------------------------------------------------
echo [BƯỚC 2/3] Bắt đầu đóng gói và xuất file .IPA trên Cloud...
echo --------------------------------------------------------------------
echo Hệ thống sẽ nén mã nguồn và gửi lên máy chủ macOS của Expo để biên dịch.
echo.
call npx eas-cli build -p ios --profile preview

echo.
echo ====================================================================
echo [BƯỚC 3/3] HOÀN TẤT!
echo ====================================================================
echo Bạn hãy bấm vào link xuất hiện ở trên để tải file .ipa về máy tính,
echo sau đó dùng Sideloadly (https://sideloadly.io) để cài vào iPhone nhé!
echo.
pause
