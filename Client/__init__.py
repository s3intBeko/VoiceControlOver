import socket
from Package.Log import Log as Logger
from Package.Config import Config
from Package.PyAudioParams import Params as PyParams

class App:
    host_name = socket.gethostname()
    _config = Config()
    def __init__(self):
        pass

    def start(self):
        pass