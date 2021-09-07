import logging
import sys
import os


class Log:
    def __init__(self):
        pass

    @staticmethod
    def write(text, color='blue'):
        if color == 'blue':
            print('\033[1;34m%s\033[1;m' % text)
        elif color == 'yellow':
            print ('\033[1;33m%s\033[1;m' % text)
        elif color == 'green':
            print ('\033[1;32m%s\033[1;m' % text)
        elif color == 'red':
            print ('\033[1;31m%s\033[1;m' % text)
        elif color == 'orange':
            print ('\033[38;5;208m%s\033[1;m' % text)
        elif color == 'magenta':
            print ('\033[1;36m%s\033[1;m' % text)
        else:
            print (text)

    @staticmethod
    def write_same_line(text, color='blue'):
        if color == 'blue':
            print ('\x1b[80D' + '\x1b[K' + '\033[1;34m' + text + '\033[1;m'),
        elif color == 'yellow':
            print ('\x1b[80D' + '\x1b[K' + '\033[1;33m' + text + '\033[1;m'),
        elif color == 'green':
            print ('\x1b[80D' + '\x1b[K' + '\033[1;32m' + text + '\033[1;m'),
        elif color == 'red':
            print ('\x1b[80D' + '\x1b[K' + ' \033[1;31m' + text + '\033[1;m'),
        elif color == 'orange':
            print ('\x1b[80D' + '\x1b[K' + '\033[38;5;208m' + text + '\033[1;m'),
        elif color == 'magenta':
            print ('\x1b[80D' + '\x1b[K' + '\033[1;36m' + text + '\033[1;m'),
        else:
            print ('\x1b[80D' + '\x1b[K' + text)

        try:
            sys.stdout.flush()
        except (SystemExit, KeyboardInterrupt, GeneratorExit, Exception):
            pass

    @staticmethod
    def logging(file_path, message):
        try:
            Log.mkdir_recursive(file_path)
            logger = logging.getLogger(file_path)
            hdlr = logging.FileHandler(file_path)
            formatter = logging.Formatter('[%(levelname)s] %(asctime)s --> %(message)s')
            hdlr.setFormatter(formatter)
            hdlr.createLock()
            logger.addHandler(hdlr)
            logger.setLevel(logging.DEBUG)
            logger.debug(message)
            hdlr.close()
            logging.shutdown()
        except (SystemExit, KeyboardInterrupt, GeneratorExit, Exception):
            pass

    @staticmethod
    def mkdir_recursive(file_path):
        path = os.path.dirname(os.path.realpath(file_path))
        sub_path = os.path.dirname(path)
        if not os.path.exists(sub_path):
            Log.mkdir_recursive(sub_path)
        if not os.path.exists(path):
            os.mkdir(path)