#!/bin/sh
# FE项目master更新 测试环境代码更新部署 脚本

# 开始
set -e

root_dir=$1 # 操作目录
git_ssh_url=$2 # 项目ssh
id=$3 # 项目 id
deploy_dir=$4 # 部署ftp路径

dirs=(A B C D E F G rd default) # 测试环境ftp目录

upload_to_ftp_path=$(pwd)/sh/upload_to_ftp.sh

# 进入root目录
cd $root_dir

if [ ! -d "$id" ];then
    git clone "$git_ssh_url" "$id"
    cd "$id"
else
    cd "$id"
    git pull --force
fi

sudo npm install --unsafe-perm

npm run build:test

# 上传
for dir in ${dirs[@]}
do
    sh "$upload_to_ftp_path" "$(pwd)"/dist "$dir""$deploy_dir"
done

cd ../

rm -fr dist

echo "deploy done"
