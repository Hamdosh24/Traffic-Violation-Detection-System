@echo off
setlocal

rem تعديل المسارات حسب مكان الفيديو و VLC
set VIDEO_PATH=C:\Users\Dell\Documents\GitHub\Traffic-Violation-Detection-System\camera_stream_simulation\sample.mp4
set VLC_PATH="C:\Program Files\VideoLAN\VLC\vlc.exe"

rem VLC يبث RTP على المنفذ 8004
start "" %VLC_PATH% "%VIDEO_PATH%" --sout=#rtp{dst=127.0.0.1,port=8004,mux=ts} --no-sout-all --sout-keep

pause
