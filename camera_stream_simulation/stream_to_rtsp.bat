@echo off
setlocal

set FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
set RTP_PORT=8004
set RTSP_TARGET=rtsp://localhost:8554/mystream

"%FFMPEG_PATH%" -f mpegts -i udp://127.0.0.1:%RTP_PORT% -c:v copy -f rtsp -rtsp_transport tcp "%RTSP_TARGET%"

pause
