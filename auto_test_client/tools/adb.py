from auto_test_script.tools.api import server_api
import auto_test_script.tools.adb as auto_test_script_adb
def connect_device(ip):
    serialno = auto_test_script_adb.get_serialno(ip)
    if(serialno):
        device = auto_test_script_adb.connect_device_serialno(serialno)
        if(device):
            if(server_api.update_devices(device)):
                return device
    return False

def disconnect_device(ip,id):
    try:
        auto_test_script_adb.disconnect_device_ip(ip)
        server_api.update_devices({
            "id":id,
            "ip":''
        })
    except:
        pass

def get_device(ip):
    data = server_api.get_devices({
        "ip":ip
    })
    if(data):
        return data[0]
    else:
        return False


