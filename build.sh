#!/bin/bash
set -e
apt-get update
apt-get install -y ffmpeg wget build-essential cmake git
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp
make
cp main /usr/local/bin/whisper
mkdir -p ../models
wget -O ../models/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin
