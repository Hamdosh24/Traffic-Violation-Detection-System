@echo off
setlocal

rem ==== إعدادات المسارات ====
set VIDEO_PATH=C:\Users\Dell\Documents\GitHub\Traffic-Violation-Detection-System\camera_stream_simulation\sample.mp4
set VLC_PATH="C:\Program Files\VideoLAN\VLC\vlc.exe"
set RTSP_URL=rtsp://localhost:8554/mystream
set OUTPUT_FILE=out_full.mp4

rem ==== تشغيل VLC لبث كامل الفيديو عبر RTSP ====
start "" %VLC_PATH% "%VIDEO_PATH%" --sout="#rtp{sdp=%RTSP_URL%}" --no-sout-all --sout-keep
echo [✓] VLC بدأ بث الفيديو بالكامل عبر RTSP: %RTSP_URL%
timeout /t 2 >nul

pause
