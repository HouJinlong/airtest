#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import socket

# 使用ip起服务,便于其他设备局域网访问
for x in range(len(sys.argv)):
    # 防止与其他命令冲突
    if(sys.argv[x] == 'ipstart'):
        # 本机 ip
        ip = socket.gethostbyname(socket.getfqdn(socket.gethostname()))
        sys.argv[x] = (ip+':8000')
        
def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auto_test_client.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    # 启动 客户端
    main()
    

