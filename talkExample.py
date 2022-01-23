'''import pyttsx3;
engine = pyttsx3.init()
voices = engine.getProperty('voices')
print(len(voices))
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

engine.say("burada olduğuma eminim")
engine.runAndWait() '''
import os
from gtts import gTTS
audio_string = 'burada olduğuma eminim'
#audio_string = 'internet bağlantısı yok gibi gözüküyor'
try:
    tts = gTTS(text=audio_string, lang='tr', slow=False)
    tts.save("audio.mp3")
    os.system("mpg321 audio.mp3 >/dev/null 2>&1")
    os.remove("audio.mp3")
except gTTS.tts.gTTSError:
    print("No Connection")
except:
    print("Somehting Else`")

#subprocess.Popen("mpg321 audio.mp3 > /dev/null", stdout=subprocess.PIPE)
