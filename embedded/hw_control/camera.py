from picamera import PiCamera
from time import sleep
import sys

if len(sys.argv) == 2:
    cnt = sys.argv[1]
    camera = PiCamera()
    camera.resolution = (1280, 720)
    camera.framerate = 60
    camera.exposure_mode = 'sports'
    #camera.image_effect = 'cartoon'
    camera.start_preview()
    sleep(3)
    camera.capture('image_%s.jpg' % cnt)
    camera.stop_preview()
