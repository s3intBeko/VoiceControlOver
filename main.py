#!/usr/bin/env python3
from Package.Log import Log
from Package.Config import Config
import sys

_logger = Log()
_config = Config()

if __name__ == "__main__":
    _config.check_config_file('config.cfg')
    diamond = (True, False)[str(_config.read('config.cfg', 'program', 'diamond')) == 'False']
    if len(sys.argv) > 1:
        apps = sys.argv[1]

    else:
        apps = _config.read('config.cfg', 'program', 'work')
    _logger.write('Program Starting as %s ' % apps)
    if apps == 'Server':
        from Server import App
        _app = App()
        _app.start()
    elif apps == 'Client':
        from Client import App
        _app = App()
        _app.start()
    else:
        _logger.write('Unknown App Type..')



