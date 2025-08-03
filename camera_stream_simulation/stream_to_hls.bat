@echo off
setlocal

rem === إعدادات المسارات ===
set FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
set RTSP_URL=rtsp://localhost:8554/mystream
set OUTPUT_DIR=C:\Users\Dell\Documents\GitHub\Traffic-Violation-Detection-System\camera_stream_simulation\hls\mystream

rem === إنشاء المجلد إذا لم يكن موجودًا ===
if not exist "%OUTPUT_DIR%" (
    mkdir "%OUTPUT_DIR%"
)

rem === تشغيل FFmpeg لتحويل RTSP إلى HLS ===
"%FFMPEG_PATH%" -rtsp_transport tcp -i "%RTSP_URL%" ^
-c:v libx264 -preset veryfast -crf 23 ^
-f hls -hls_time 2 -hls_list_size 6 -hls_flags delete_segments ^
"%OUTPUT_DIR%\index.m3u8"

pause
