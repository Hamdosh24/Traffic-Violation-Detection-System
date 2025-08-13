@echo off
setlocal

set RTSP_URL=%1
set OUTPUT_DIR=%2

REM إصلاح الشرط المائلة (إذا ضروري)
set OUTPUT_DIR=%OUTPUT_DIR:/=\%

echo RTSP URL is: %RTSP_URL%
echo Output directory is: %OUTPUT_DIR%

REM إنشاء المجلد إذا غير موجود
if not exist "%OUTPUT_DIR%" (
    mkdir "%OUTPUT_DIR%"
)

REM تشغيل ffmpeg مع تسجيل اللوج في ملف داخل مجلد الإخراج
"C:\ffmpeg\bin\ffmpeg.exe" -rtsp_transport udp -i "%RTSP_URL%" -c:v libx264 -preset veryfast -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments "%OUTPUT_DIR%\index.m3u8" > "%OUTPUT_DIR%\ffmpeg_output.log" 2>&1

REM لا نستخدم pause هنا لتجنب تعليق التنفيذ عند التشغيل من Laravel

endlocal
