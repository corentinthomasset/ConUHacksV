#!/usr/bin/env python

import RPi.GPIO as GPIO
import time
import sys

# Set 8 Pins for 8 LEDs.
LedPins = [17, 18, 27, 22, 23, 24, 4]
# Define a setup function for some setup
def setup():
	# Set the GPIO modes to BCM Numbering
	GPIO.setmode(GPIO.BCM)
	# Set all LedPin's mode to output, 
	# and initial level to High(3.3v)
	GPIO.setup(LedPins, GPIO.OUT, initial=GPIO.HIGH)
	
	time.sleep(3)

# Define a main function for main process
def main():
	if len(sys.argv) == 2:
		if int(sys.argv[1]) == 1:
			for pin in LedPins:
				GPIO.output(pin, GPIO.LOW)
		elif int(sys.argv[1]) == 0:
			for pin in LedPins:
				GPIO.output(pin, GPIO.HIGH)

def destroy():
	# Turn off all LEDs
	GPIO.output(LedPins, GPIO.HIGH)
	# Release resource
	GPIO.cleanup()

# If run this script directly, do:
if __name__ == '__main__':
	setup()
	#try:
	main()
	# When 'Ctrl+C' is pressed, the child program 
	# destroy() will be  executed.
#	except KeyboardInterrupt:
		#destroy()

