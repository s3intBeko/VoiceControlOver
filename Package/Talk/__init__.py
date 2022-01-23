import os
from gtts import gTTS
class Talk:
    
    
    def __init__(self) -> None:
        pass

    @staticmethod
    def Say(text):
        tempo = '1.3'
        try:
            tts = gTTS(text=text, lang='tr', slow=False)
            tts.save("audio.mp3")
            os.system("play audio.mp3 tempo %s >/dev/null 2>&1" %tempo)
            #os.remove("audio.mp3")
        except gTTS.tts.gTTSError:
            os.system("play noConnection.mp3 tempo %s >/dev/null 2>&1" %tempo)
            print("No Connection")
        except:
            os.system("play SomeError.mp3 tempo %s >/dev/null 2>&1" %tempo)
            print("Somehting Else`")