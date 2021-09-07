import pyaudio

class Params:
    Format = pyaudio.paInt16
    Channels = 1
    Rate = 44100
    Chunk = 4096
    BufferSize = 4096
    SampWidth = pyaudio.get_sample_size(pyaudio.paInt16)

    '''@staticmethod
    def Format():
        return  pyaudio.paInt16

    @staticmethod
    def Channels():
        return 1

    @staticmethod
    def Rate():
        return 44100

    @staticmethod
    def Chunk():
        return 4096

    @staticmethod
    def Format():
        return pyaudio.paInt16'''





