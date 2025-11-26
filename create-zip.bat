@echo off
echo Creating deployment ZIP file...
echo.

cd out

if exist "..\deployment.zip" del "..\deployment.zip"

powershell -command "Compress-Archive -Path * -DestinationPath ..\deployment.zip -Force"

cd ..

echo.
echo ========================================
echo ZIP file created: deployment.zip
echo ========================================
echo.
echo Next steps:
echo 1. Go to Hostinger File Manager
echo 2. Upload deployment.zip to public_html
echo 3. Right-click deployment.zip and select "Extract"
echo 4. Delete deployment.zip after extraction
echo.
pause
