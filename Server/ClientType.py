class ClientType:

    def __init__(self):
        self.ip_address= None
        self.room = None
        self.file = bytearray()
        self.receiving_file = False
        self.socket = None

    def file_sent(self):
        self.receiving_file = False
        self.file = bytearray()

    def file_sending(self):
        self.receiving_file = True

    def file_data(self,data):
        self.file.extend(data)

    def get_file(self):
        return bytes(self.file)