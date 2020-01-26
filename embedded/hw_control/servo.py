import RPi.GPIO as GPIO
import time
import sys

#----------------------------------
#
#	Arguments
#		Open : 0
#		Close : 1
#
#--------------------------------


GPIO.setmode(GPIO.BOARD)

GPIO.setup(12, GPIO.OUT)

p = GPIO.PWM(12, 50)

#print("Choisir une action")
if len(sys.argv) == 2:
	choice = sys.argv[1]
	# print(choice)
	# print sys.argv
	p.start(0)

	try:
		if(int(choice) == 0): 
			p.ChangeDutyCycle(7.5)  # turn towards 90 degree
			time.sleep(1) # sleep 1 second
		elif(int(choice) == 1):
			p.ChangeDutyCycle(2.5)  # turn towards 90 degree
			time.sleep(1) # sleep 1 second
		else:
			# print('Out of parameter range')
			sys.exit()
	except KeyboardInterrupt:
		p.stop()
		GPIO.cleanup()