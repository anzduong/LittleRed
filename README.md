### Little Red
#### by An Duong


## Overview
This is a project focusing on the gender violence women face daily. It is recreated through a modern retelling of Little Red Riding Hood as a metaphor of being preyed upon (unknowingly). 


  

## Functions

###constructor( _duration );
This will allocate the Timer object, duration is in milliseconds
e.g.

var simpleTimer = new Timer(5000);

###start();
This will start the timer

simpleTimer.start()

###setTimer(_duration) 
Changes the duration of the timer, also in milliseconds

###expired();
Returns true if the timer is expired, false if it is still running.

###getRemainingTime();
Returns the number of milliseconds left in the timer, zeero if it is expired

###getPercentageRemaining();
Returns percentage remaining in the timer, 0.0 through 1.0. If expired, will return 0.0


###getPercentageElapsed();
Returns percentage elapsed in the timer, 0.0 through 1.0. If expired, will return 1.0


getPercentageRemaining() + getPercentageElapsed() should always be 1.0

## License
CC BY: This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use.
