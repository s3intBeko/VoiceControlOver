import socket
from Package.Log import Log as Logger
from Package.Config import Config
from Package.PyAudioParams import Params as PyParams
from Package.Snowboy import snowboydecoder
import os

class App:
    host_name = socket.gethostname()
    _config = Config()
    model_path = './Package/Snowboy/Resources/Models/'
    models = []
    def __init__(self):
        self.get_models()

    def get_models(self):
        for f in os.listdir(self.model_path):
            self.models.append('%s%s' % (self.model_path, f))
        print(self.models)

    def start(self):
        pass