import pyttsx3;

class TalkX:
    def __init__(self) -> None:
        pass

    @staticmethod
    def Say(text):
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        voiceId = 0
        for voice in engine.getProperty('voices'):    
            if "turkish" in voice.id:
                print("Voice:")
                print(" - ID: %s" % voice.id)
                print(" - Name: %s" % voice.name)
                print(" - Languages: %s" % voice.languages)
                print(" - Gender: %s" % voice.gender)
                print(" - Age: %s" % voice.age)
                voiceId = voice.id
                
        #voice = voices[11]
        #voice.languages =[b'\x05tr']
        #voice.gender = "naturel"
        engine.setProperty('rate', 165)
        engine.setProperty('voice', "turkish+f5")

        engine.say(text)
        engine.runAndWait()