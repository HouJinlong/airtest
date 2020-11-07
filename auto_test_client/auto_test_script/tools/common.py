import shutil
import time
import os
import re
from auto_test_script.tools.config import AIR_ROOT

# 初始化目录
def init_dir(path,clear=False):
    if(os.path.exists(path)):
        if(clear):
            shutil.rmtree(path)
            init_dir(path)
    else:
        os.makedirs(path)
    time.sleep(1.0)

# 运行命令行命令
def run_cmd(cmd_arr):
    cmd = ' && '.join(cmd_arr)
    try:
        os.system(cmd)
        return True
    except:
        return False

# 准备脚本
def init_air(data):
    init_dir(AIR_ROOT)
    git_path = os.path.join(AIR_ROOT,data['git_id'])
    cmd_arr = []
    if(os.path.exists(git_path)):
        # 存在 更新
        cmd_arr.append('cd '+git_path)
        cmd_arr.append('git pull')
    else:
        # 不存在 拉取
        cmd_arr.append('cd '+ AIR_ROOT)
        cmd_arr.append('git clone '+data['git_url'] +' '+ data['git_id'])
    run_cmd(cmd_arr)
    return os.path.join(git_path,data['path'])

# 去除文件名中不能包含的 符号
def validate_dirname(str):
    rstr = r"[\/\\\:\*\?\"\<\>\|]"  # '/ \ : * ? " < > |'
    return re.sub(rstr, "_", str)  # 替换为下划线