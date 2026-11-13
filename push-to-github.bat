@echo off
cd /d "%~dp0"
set PATH=C:\Users\Admin\AppData\Local\Programs\Git\cmd;%PATH%
echo ========================================================
echo        ĐẨY MÃ NGUỒN LÊN GITHUB ĐỂ TỰ ĐỘNG XUẤT .IPA
echo ========================================================
echo.
git push -u origin master
echo.
echo ========================================================
echo Hoan tat! Ban hay vao GitHub de xem tien trinh xuat file .ipa nhe.
echo ========================================================
pause
