@echo off
setlocal

rem ==== إعداد المسارات ====
set FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
set MEDIA_MTX_PATH=C:\mediamtx\mediamtx.exe

set VIDEO1_PATH=%~dp0cam1.mp4
set VIDEO2_PATH=%~dp0cam2.mp4
set VIDEO3_PATH=%~dp0cam3.mp4


set STREAM1_URL=rtsp://127.0.0.1:8554/cam1
set STREAM2_URL=rtsp://127.0.0.1:8554/cam2
set STREAM3_URL=rtsp://127.0.0.1:8554/cam3

rem ==== تشغيل MediaMTX مرة واحدة ====
start "" "%MEDIA_MTX_PATH%" "%~dp0mediamtx.yml"

timeout /t 5 /nobreak

rem ==== تشغيل البث لكل كاميرا في نافذة مستقلة ====
start "Cam1 Stream" /min "%FFMPEG_PATH%" -re -stream_loop -1 -i "%VIDEO1_PATH%" -c:v libx264 -preset ultrafast -tune zerolatency -g 30 -r 15 -c:a aac -f rtsp -rtsp_transport udp %STREAM1_URL%
start "Cam2 Stream" /min "%FFMPEG_PATH%" -re -stream_loop -1 -i "%VIDEO2_PATH%" -c:v libx264 -preset ultrafast -tune zerolatency -g 30 -r 15 -c:a aac -f rtsp -rtsp_transport udp %STREAM2_URL%
start "Cam3 Stream" /min "%FFMPEG_PATH%" -re -stream_loop -1 -i "%VIDEO3_PATH%" -c:v libx264 -preset ultrafast -tune zerolatency -g 30 -r 15 -c:a aac -f rtsp -rtsp_transport udp %STREAM3_URL%

pause
