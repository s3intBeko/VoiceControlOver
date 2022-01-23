import socket
import signal,threading
import time
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
    interrupted = False
    _connected = False
    _connect_try = 5
    _connect_try_counter = 0
    _run = True


    def __init__(self):
        self.get_models()
        self.detector = None
        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        #self.client_socket.settimeout(5)
        self.name = self._config.read('config.cfg', 'program', 'name')
        self.wakeup_response = self._config.read('config.cfg', 'client', 'keyword_response')


        self.server_address = (
            self._config.read('config.cfg', 'server', 'address'),
            int(self._config.read('config.cfg', 'server', 'port'))
        )
        self.sensitivity = float(self._config.read('config.cfg', 'voice', 'sensitivity'))
        if not self.sensitivity:
            self.sensitivity = 0.4
        self.gain = float(self._config.read('config.cfg', 'voice', 'gain'))
        if not self.sensitivity:
            self.sensitivity = 1
        self.connect_socket()

    def connect_socket(self):
        Logger.write("Socket Connection Starting ", 'yellow')
        err_code = 0
        try:
            self.client_socket.connect(self.server_address)
            self._connected = True
            self._connect_try_counter = 0
            time.sleep(1)
            msg = 'n:%s' %self.name
            self.client_socket.send(msg.encode())
        except socket.error as err:
            err_code = err.errno
            Logger.write("Socket Connection Error : %s - %s" % (err,err.errno),'red')
        except ConnectionRefusedError:
            Logger.write("Socket Connection Refused Error ", 'red')
        except:
            Logger.write("Socket Unexpected Error ", 'red')
            raise
        if not self._connected:
            if err_code == 106:
                self.client_socket.close()
                self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            if self._connect_try > self._connect_try_counter:
                self._connect_try_counter += 1
                time.sleep(10)
                self.connect_socket()
            else:
                Logger.write("Exceed Max Try")
                exit(1)

    def listen_socket(self):
        Logger.write("Starting To Listen Server")
        while self._run:
            if self._connected:
                try:
                    data = self.client_socket.recv(PyParams.BufferSize)
                    if data:
                        Logger.write("Received  : %s" % data.decode(),'green')
                    else:
                        Logger.write('Connection Lost Retry in 3 seconds')
                        self._connected = False
                        time.sleep(3)
                        self.connect_socket()

                except:
                    print('Socket Listen Raise Error')
                    raise
            else:
                time.sleep(5)
    def get_models(self):
        for f in os.listdir(self.model_path):
            self.models.append('%s%s' % (self.model_path, f))

    def audio_recorder_callback(self, sound_bytes):
        if not self._connected:
            return
        data = [sound_bytes[i:i+PyParams.BufferSize] for i in range(0, len(sound_bytes), PyParams.BufferSize)]
        msg = 'a:send'
        self.client_socket.send(msg.encode())
        time.sleep(1)
        for d in data:
            self.client_socket.send(d)
        self.client_socket.send(b"\n\r\0")

    def detected_callback(self):
        Logger.write("Wake Up")
        if self.wakeup_response == "bip":
            os.system("play ding.mp3  >/dev/null 2>&1")
        elif self.wakeup_response == "talk":
            os.system("play listenYou.mp3  >/dev/null 2>&1")
        else:
            pass
        #print('recording audio...', end='', flush=True)

    def signal_handler(self, signal, frame):
        self.interrupted = True

    def interrupt_callback(self):
        return self.interrupted

    def start(self):
        sensitivity = self.sensitivity * len(self.models)
        t1 = threading.Thread(target=self.listen_socket, args=())
        t1.start()
        Logger.write("Decoder Starting Sens : %s Gain : %s" % (self.sensitivity,self.gain))
        self.detector = snowboydecoder.HotwordDetector(self.models, sensitivity=self.sensitivity, audio_gain=self.gain)
        self.detector.start(
            detected_callback=self.detected_callback,
            audio_recorder_callback=self.audio_recorder_callback,
            interrupt_check=self.interrupt_callback,
            sleep_time=0.01
        )
        self.detector.terminate()