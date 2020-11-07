import base64
import io

import qrcode

# 获取 二维码 base64 格式
def get_qrcode_base64(data):
    qr = qrcode.QRCode(     
        version=1,     
        error_correction=qrcode.constants.ERROR_CORRECT_L,     
        box_size=10,     
        border=1, 
    )
    qr.make(fit=True) 
    qr.add_data(data)
    img = qr.make_image()

    buf = io.BytesIO()
    img.save(buf,format='PNG')
    image_stream = buf.getvalue()
    heximage = base64.b64encode(image_stream)
    return 'data:image/png;base64,' + heximage.decode()