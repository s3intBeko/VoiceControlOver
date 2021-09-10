import socket
import select
import wave
import time
import threading
import platform
from Package.Log import Log as Logger
from Package.Config import Config
from Package.PyAudioParams import Params as PyParams
from Server.ClientType import ClientType
from Package.Recognition.Google import Google

class App:
    host_name = socket.gethostname()
    _config = Config()


    def __init__(self):
        self.run = True
        self.google = Google()
        self.google.feedback += self.google_reply
        self.server = [
            self._config.read('config.cfg', 'server', 'address'),
            self._config.read('config.cfg', 'server', 'port')
        ]

        self.server_socket = None
        self.client_list = {}
        self.read_list =[]
        Logger.write('Platform : %s' % platform.machine())

        Logger.write("Server Init %s " % self.server)
        Logger.write("Params Sample Rate : %s" % PyParams.Rate)

    def server_stream_audio(self):
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            self.server_socket.bind((self.server[0],int(self.server[1])))
            self.read_list = [self.server_socket]
        except OSError:
            Logger.write("Already In Use")
            time.sleep(3)
            self.server_stream_audio()
            return
        self.server_socket.listen(10)
        self.read_list = [self.server_socket]
        Logger.write("Server Streaming Audio %s " % self.server)
        try:
            while self.run:
                readable, writable, errored = select.select(self.read_list, [], [])

                for s in readable:
                    if s is self.server_socket:
                        (clientsocket, address) = self.server_socket.accept()
                        print("Connection from", address)
                        self.read_list.append(clientsocket)
                        client = ClientType()
                        client.ip_address = address
                        client.socket = clientsocket
                        self.client_list[address] = client
                        #self.file_list[address] = bytearray()
                    else:
                        data = s.recv(PyParams.BufferSize)
                        try:
                            if not self.client_list[address].receiving_file:
                                rec_msg = str(data.decode())
                                Logger.write(rec_msg,'green')
                                if rec_msg.startswith('n'):
                                    self.client_list[address].name = rec_msg.split(':')[1]
                                    msg = 's:success:%s' % self.client_list[address].name
                                    self.send_message(clientsocket, msg)
                                elif rec_msg == 'a:send':
                                    self.client_list[address].receiving_file = True
                                    self.send_message(clientsocket, 's:success:waiting')
                            else:
                                if data[-3:] == b'\n\r\0':
                                    self.send_message(clientsocket, 's:success:handled')
                                    file_name = self.save_file(self.client_list[address].get_file())
                                    self.client_list[address].file_sent()
                                    self.understand_it(self.client_list[address].name, file_name)

                                else:
                                    self.client_list[address].file_data(data)
                        except:
                            raise
                            pass

                        if not data:
                            clean = None
                            print('Cleaning Client')
                            for a in self.client_list.keys():
                                if self.client_list[a].socket == s:
                                    clean = a
                            if clean:
                                self.client_list.pop(a)
                            self.read_list.remove(s)
            pass
        except KeyboardInterrupt:
            self.run = False
            exit(1)
        finally:
            self.server_socket.close()


    def google_reply(self,identifier, command, payload):
        Logger.write('[%s] %s : %s ' %(identifier,command,payload), 'green')

    @staticmethod
    def send_message(client,msg):
        if client:
            client.send(msg.encode())
    @staticmethod
    def save_file(data):
        _record_path =''# './Package/Snowboy/Recorded/'
        filename = _record_path + 'output_' + str(int(time.time()))
        # writes data to WAV file
        #data = data  # ''.join(data)
        wf = wave.open(filename + '.wav', 'wb')
        wf.setnchannels(PyParams.Channels)
        wf.setsampwidth(PyParams.SampWidth)
        wf.setframerate(PyParams.Rate)
        wf.writeframes(data)
        wf.close()
        return filename + '.wav'

    def understand_it(self,identifier, file_name):
        self.google.recognise_file(identifier,file_name)

    def start(self):
        Logger.write("Server Starting %s " % self.server)
        t1 = threading.Thread(target=self.server_stream_audio, args=())
        #t1 = PropagatingThread(target=self.server_stream_audio, args=())
        t1.start()
        Logger.write("Server Started %s " % self.server)

class PropagatingThread(threading.Thread):
    def run(self):
        self.exc = None
        try:
            if hasattr(self, '_Thread__target'):
                # Thread uses name mangling prior to Python 3.
                self.ret = self._Thread__target(*self._Thread__args, **self._Thread__kwargs)
            else:
                self.ret = self._target(*self._args, **self._kwargs)
        except BaseException as e:
            self.exc = e

    def join(self, timeout=None):
        super(PropagatingThread, self).join(timeout)
        if self.exc:
            raise self.exc
        return self.ret