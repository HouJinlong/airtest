from airtest.core.android.adb import ADB
from auto_test_script.tools.config import ADB_PORT

def get_ip_devices():
    devices = get_on_devices()
    ret_devices = []
    for device in devices:
        if is_ip_device(device)==True:
            ret_devices.append(device)
    return ret_devices

def get_usb_devices():
    devices = get_on_devices()
    ret_devices = []
    for device in devices:
        if is_ip_device(device)==False:
            # USB连接 获取ip
            device_adb = ADB(device)
            ip = device_adb.get_ip_address()
            try:
                devices.index(ip+ADB_PORT)
            except:
                ret_devices.append(device)
    return ret_devices
# ip连接设备
def adb_ip_connect(ip):
    wifi_adb = ADB()
    wifi_adb.serialno = ip+ADB_PORT
    wifi_adb.connect(True)
    try:
        wifi_adb_status = wifi_adb.get_status()
        if wifi_adb_status=="device":
            device_info = wifi_adb.get_device_info()
            return {
                'ip':ip,
                "status":'0',
                "model":device_info["model"],
                "manufacturer":device_info["manufacturer"],
                "platform":device_info["platform"],
            }
        else:
            wifi_adb.disconnect()
            return False
    except:
        wifi_adb.disconnect()
        return False
def connect_all():
    devices= get_usb_devices()
    device_infos = []
    for device in devices:
        device_adb = ADB(device)
        ip = device_adb.get_ip_address()
        # 用adb tcpip模式重启adb
        device_adb.cmd(['tcpip',ADB_PORT[1:]])
        device_info = adb_ip_connect(ip)
        if(device_info):
            device_info['id'] = device
            device_infos.append(device_info)
    return device_infos

    
def get_off_devices(old_devices,on_devices_id):
    off_devices = []
    for ip in old_devices:
        old_device = old_devices[ip]
        try:
            on_devices_id.index(old_device['id'])
        except:
            off_device = old_device
            off_device['status']='1'
            off_devices.append(off_device)
    return off_devices

def get_device(serialno,on_devices,old_devices):
    ip = is_ip_device(serialno)
    device_info = None
    if ip:
        try:
            device_info = old_devices[ip]
            device_info['status'] ='0'
        except:
            pass
    else:
        try:
            # USB连接 获取ip
            device_adb = ADB(serialno)
            ip = device_adb.get_ip_address()
            try:
                # 该USB已通过ip连接
                old_devices[ip]
                on_devices.index(ip+ADB_PORT)
            except:
                # 用adb tcpip模式重启adb
                device_adb.cmd(['tcpip',ADB_PORT[1:]])
                device_info = adb_ip_connect(ip)
                device_info['id'] = serialno
        except:
                pass
    return device_info
# 获取所有连接设备
def get_on_devices():
    devices = ADB().devices()
    on_devices = []
    for device in devices:
        serialno,status = device
        if status=="device":
            on_devices.append(serialno)
    return on_devices
#判断设备的连接方式            
def is_ip_device(serialno):
    try:
        # ip连接
        serialno.index(ADB_PORT)
        return True
    except:
        return False
# ip 换 serialno
def get_serialno(ip):
    devices = get_on_devices()
    for device in devices:
        if(not is_ip_device(device)):
            # USB连接 获取ip
            device_adb = ADB(device)
            device_ip = device_adb.get_ip_address()
            if(ip == device_ip):
                return device
    return None
# serialno 连接设备
def connect_device_serialno(serialno):
    device_adb = ADB(serialno)
    ip = device_adb.get_ip_address()
    # 用adb tcpip模式重启adb
    device_adb.cmd(['tcpip',ADB_PORT[1:]])
    device = connect_device_ip(ip)
    if(device):
        device['id'] = serialno
        return device
    return None
# ip 连接设备  
def connect_device_ip(ip):
    wifi_adb = ADB()
    wifi_adb.serialno = ip+ADB_PORT
    wifi_adb.connect(True)
    try:
        wifi_adb_status = wifi_adb.get_status()
        if wifi_adb_status=="device":
            device_info = wifi_adb.get_device_info()
            return {
                'ip':ip,
                "model":device_info["model"],
                "manufacturer":device_info["manufacturer"],
                "platform":device_info["platform"],
            }
        else:
            wifi_adb.disconnect()
            return False
    except:
        wifi_adb.disconnect()
        return False
# ip 断开连接设备  
def disconnect_device_ip(ip):
    wifi_adb = ADB()
    wifi_adb.serialno = ip+ADB_PORT
    wifi_adb.disconnect()




