import speech_recognition as sr
from Package.ReplyHandler import ReplyHandler
from Package.Log import Log as Logger
import os

class Google:

    feedback = ReplyHandler()

    def __init__(self):
        pass

    def recognise_file(self,identify, file_path):
        if not os.path.isfile(file_path):
            Logger.write("We Cant Find File.", 'red')
            return
        r = sr.Recognizer()
        audio_file = sr.AudioFile(file_path)
        with audio_file as source:
            audio = r.record(source)
        try:
            data = r.recognize_google(audio, language='tr-tr')
            self.feedback(identify, 'Recognize', data)
        except sr.UnknownValueError:
            self.feedback(identify, 'Error', 'Count Understand')
        except sr.RequestError as e:
            self.feedback(identify, 'Error', str(e))