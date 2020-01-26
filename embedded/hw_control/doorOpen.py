import RPi.GPIO as GPIO

ledPin = 32    # define the ledPin
sensorPin = 37    # define the sensorPin

def setup():
        GPIO.setmode(GPIO.BOARD)       # Numbers GPIOs by physical location
        GPIO.setup(ledPin, GPIO.OUT)   # Set ledPin's mode is output
        GPIO.setup(sensorPin, GPIO.IN)    # Set sensorPin's mode is input

def loop():
        while True:
                if GPIO.input(sensorPin)==GPIO.HIGH:
                        GPIO.output(ledPin,GPIO.HIGH)
                        print ('Door is open')
                else :
                        GPIO.output(ledPin,GPIO.LOW)
                        print ('Door is closed')

def destroy():
        GPIO.cleanup()                     # Release resource

if __name__ == '__main__':     # Program start from here
        setup()
        try:
                loop()
        except KeyboardInterrupt:  # When 'Ctrl+C' is pressed, the child program destroy() will be  executed.
                destroy()
