#!/bin/sh
#用来将文件上传到ftp，输入参数：文件名（包括路径）、ftp的IP、ftp的端口、用户名、密码
dir=$1
ftp_dir=$2
ip=
port=
user=
pwd=

lftp -u $user,$pwd -p $port $ip <<EOF
mirror -R "$dir" "$ftp_dir"
bye
EOF
echo "ftp done"
