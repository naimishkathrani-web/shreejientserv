@echo off
echo ========================================
echo Building Shreeji Enterprise Services
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo Step 2: Building static site...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo Step 3: Copying PHP handlers and .htaccess...
if not exist "out" (
    echo ERROR: out folder not found
    pause
    exit /b 1
)
copy "public\send-email.php" "out\send-email.php"
copy "public\send-contact.php" "out\send-contact.php"
copy "public\smtp-mailer.php" "out\smtp-mailer.php"
copy "public\test-email.php" "out\test-email.php"
copy "htaccess.txt" "out\.htaccess"

echo.
echo ========================================
echo BUILD COMPLETE!
echo ========================================
echo.
echo Your deployment files are ready in the "out" folder.
echo.
echo Next steps:
echo 1. Open FileZilla or Hostinger File Manager
echo 2. Upload ALL files from the "out" folder to public_html
echo 3. Make sure send-email.php is also uploaded
echo 4. Update the email address in send-email.php if needed
echo.
pause
