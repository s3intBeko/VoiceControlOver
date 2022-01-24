from Package.ReplyHandler import ReplyHandler
from Package.Log import Log as Logger
class AI:
    feedback = ReplyHandler()
    
    def __init__(self) -> None:
        pass
    def undestand(self,payload):
        if ':' in payload:
            parts = str(payload).split(':')
            if len(parts) < 3:
                Logger.write("UnRecognised Command: %s " %payload, 'red')
                return
            if parts[1] == 'success':
                Logger.write("%s Command is Success" % parts[2], 'green')
            elif parts[1] == 'talk':                
                self.feedback('talk',parts[2])
        else:
            Logger.write("UnRecognised Command: %s " %payload, 'red')
            

