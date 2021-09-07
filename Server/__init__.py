import socket
import select
import wave
import time
import threading
import platform
from Package.Log import Log as Logger
from Package.Config import Config
from Package.PyAudioParams import Params as PyParams

class App:
    host_name = socket.gethostname()
    _config = Config()

    def __init__(self):
        self.run = True
        self.server = [
            self._config.read('config.cfg', 'server', 'address'),
            self._config.read('config.cfg', 'server', 'port')
        ]
        self.server_socket = None
        self.read_list = None
        self.file_list = {}
        Logger.write('Platform : %s' % platform.machine())
        Logger.write("Server Init %s " % self.server)
        Logger.write("Params Sample Rate : %s" % PyParams.Rate)

    def server_stream_audio(self):
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.bind((self.server[0],int(self.server[1])))
        self.server_socket.listen(10)
        self.read_list = [self.server_socket]
        Logger.write("Server Streaming Audio %s " % self.server)
        try:
            while self.run:
                readable, writable, errored = select.select(self.read_list, [], [])
                for s in readable:
                    if s is self.server_socket:
                        (clientsocket, address) = self.server_socket.accept()
                        self.read_list.append(clientsocket)
                        print("Connection from", address)
                        self.file_list[address] = bytearray()
                    else:
                        data = s.recv(PyParams.BufferSize)
                        # print(data[-3:])
                        # save_file(data)
                        if data[-3:] == b"\n\r\0":
                            print("END OF FILE ")
                            self.save_file(bytes(self.file_list[address]))
                            self.file_list[address] = bytearray()
                        else:
                            self.file_list[address].extend(data)

                        if not data:
                            self.read_list.remove(s)
            pass
        except KeyboardInterrupt:
            pass
        finally:
            self.server_socket.close()

    @staticmethod
    def save_file(data):
        filename = 'output_' + str(int(time.time()))
        # writes data to WAV file
        #data = data  # ''.join(data)
        wf = wave.open(filename + '.wav', 'wb')
        wf.setnchannels(PyParams.Channels)
        wf.setsampwidth(PyParams.SampWidth)
        wf.setframerate(PyParams.Rate)
        wf.writeframes(data)
        wf.close()
        return filename + '.wav'

    def start(self):
        Logger.write("Server Starting %s " % self.server)
        t1 = threading.Thread(target=self.server_stream_audio, args=())
        t1.start()
        Logger.write("Server Started %s " % self.server)