@echo off
setlocal

rem ==== إعداد المسارات ====
set VIDEO_PATH=C:\Users\Dell\Documents\GitHub\Traffic-Violation-Detection-System\camera_stream_simulation\sample2.mp4
set FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
set VLC_PATH=C:\Program Files\VideoLAN\VLC\vlc.exe
set MEDIA_MTX_PATH=C:\mediamtx\mediamtx.exe
set STREAM_URL=rtsp://127.0.0.1:8554/mystream

start /min "" "C:\mediamtx\mediamtx.exe"

timeout /t 5 /nobreak

:loop
"%FFMPEG_PATH%" -re -i "%VIDEO_PATH%" -c:v libx264 -preset ultrafast -tune zerolatency -g 30 -r 15 -c:a aac -f rtsp -rtsp_transport tcp %STREAM_URL%
goto loop

pause