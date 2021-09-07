
from configparser import ConfigParser
import sys
import os

sys.path.append('../')
from Package.Log import Log


class Config:

    def __init__(self):
        pass

    @staticmethod
    def write(cfg_file, section, key, value):
        try:
            parser = ConfigParser()
            parser.read(cfg_file)

            if not parser.has_section(section):
                parser.add_section(section)

            parser.set(section, key, str(value))

            with open(cfg_file, 'w') as configfile:
                parser.write(configfile)
                configfile.close()
        except (SystemExit, KeyboardInterrupt, GeneratorExit, Exception) as ee:
            Log.write('Config cannot be write!' + str(ee), 'red')

    @staticmethod
    def read(cfg_file, section, key):
        if not os.path.isfile(cfg_file):
            return

        try:
            parser = ConfigParser()
            parser.read(cfg_file)

            with open(cfg_file, 'r') as configfile:
                #parser.readfp(configfile)
                parser.read_file(configfile)
                configfile.close()

            return parser.get(section, key)
        except (SystemExit, KeyboardInterrupt, GeneratorExit, Exception) as ee:
            Log.write('Config cannot be read!' + str(ee), 'red')

    @staticmethod
    def create_config(cfg_file):
        if os.path.isfile(cfg_file):
            return
        Config.write(cfg_file, 'program', 'diamond', False)
        Config.write(cfg_file, 'program', 'work', "Server")
        Config.write(cfg_file, 'server', 'address', "192.168.0.105")
        Config.write(cfg_file, 'server', 'port', 2121)
        Config.write(cfg_file, 'voice', 'sensitivity', 0.4)


        Config.write(cfg_file, 'knx', 'router_ip', "192.168.0.153")

    @staticmethod
    def check_config_file(cfg_file):
        if not os.path.isfile(cfg_file):
            Config.create_config(cfg_file)