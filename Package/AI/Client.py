from Package.Talk import Talk
from Package.ReplyHandler import ReplyHandler
from Package.Log import Log as Logger
class AI:
    feedback = ReplyHandler()
    
    def __init__(self) -> None:
        pass

    @staticmethod
    def undestand(payload):
        if ':' in payload:
            parts = str(payload).split(':')
            if len(parts) < 3:
                Logger.write("UnRecognised Command: %s " %payload, 'red')
                return
            if parts[1] == 'success':
                Logger.write("%s Command is Success" % parts[2], 'green')
            elif parts[1] == 'talk':
                Talk.Say(parts[2])
        else:
            Logger.write("UnRecognised Command: %s " %payload, 'red')
            

