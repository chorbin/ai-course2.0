@echo off
chcp 65001 >nul
echo ========================================
echo   AI课程学习网站
echo ========================================
echo.
echo 正在启动服务器...
echo.
echo 请在浏览器中访问:
echo   http://localhost:8000
echo.
echo 如果遇到中文文件加载问题，请尝试:
echo   1. 使用 Chrome 或 Edge 浏览器
echo   2. 确保浏览器编码设置为 UTF-8
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

cd /d "%~dp0"

REM Try npx http-server first (better UTF-8 support)
where npx >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo 使用 Node.js http-server...
    npx http-server -p 8000 --cors -c-1
    goto :end
)

REM Fallback to Python
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo 使用 Python http.server...
    python -m http.server 8000
    goto :end
)

echo.
echo 错误: 未找到 npx 或 python
echo 请安装 Node.js 或 Python
echo.
pause

:end