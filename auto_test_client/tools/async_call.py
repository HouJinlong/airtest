#coding:utf-8
from threading import Thread
# 异步调用
# @async_call
# def async_fn( self ):
#     ....
def async_call(fn):
    def wrapper(*args, **kwargs):
        Thread(target=fn, args=args, kwargs=kwargs).start()

    return wrapper