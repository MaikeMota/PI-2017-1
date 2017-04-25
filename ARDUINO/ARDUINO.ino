#include <avr/interrupt.h>
#include <avr/io.h>

#define PI 3.14159

#define TRIGGER_PIN 6
#define ECHO_PIN 7

volatile float radius = 10;
volatile float totalheight = 25.2;
volatile float mininumheight = 22.8;

volatile long frequency = 0;
long lastTime = 0;
long currentTime = 0;

/**
* Calculates the actual water volume of the recipient in Liters.
* @param float radius The radius of the recipient.
* @param float actualheight Actual height of the water level.
* @returns float the current water volume (L).
*/
float calculateWaterVolume(float radius, float actualheight)
{
  float currentVolume = (PI * pow(radius, 2) * (totalheight - actualheight));
#ifdef DEBUG
  Serial.print(F("Radius: "));
  Serial.print(currentVolume);
  Serial.print(F(" Actual Height: "));
  Serial.print(actualheight);
  Serial.print(F(" Current Volume: "));
  Serial.print(currentVolume);
#endif // DEBUG
  return currentVolume;
}

/**
* Read the distance sensor and returns the current height in CM.
* @returns float current water height.
*/
float readWaterHeight()
{
  long microsec = ultrasonic.timing();
  float cm = ultrasonic.convert(microsec, Ultrasonic::CM);
#ifdef DEBUG
  Serial.print(F(" Total Microseconds: "));
  Serial.print(microsec);
  Serial.print(F(" Current distance (cm): "));
  Serial.print(cm);
#endif //DEBUG
  return cm;
}

/**
* Checks Actual Recipient Volume
*/
void checkRecipientVolume()
{
}

void setup()
{
  pinMode(13, OUTPUT);
  pinMode(2, INPUT);
  pinMode(3, INPUT);
  Serial.begin(9600);
  EICRA = (1 << ISC11) | (1 << ISC10); // Set INT0 and INT1 to interrupt at RISING
  /* Serial.println(ISC11, BIN);
  Serial.println(1 << ISC11, BIN);
  Serial.println(ISC10, BIN);
  Serial.println(1 << ISC10, BIN);
  Serial.println(ISC01, BIN);
  Serial.println(1 << ISC01, BIN);
  Serial.println(ISC00, BIN);
  Serial.println(1 << ISC00, BIN);*/
  EIMSK |= (1 << INT0) | (1 << INT1); // Turns on INT0 and INT1
  sei();                              // Enable interrupts
}

void loop()
{
  currentTime = millis();
  if (currentTime >= (lastTime + 1000))
  {
    lastTime = currentTime;
    //Serial.println(frequency / 7.5);
    digitalWrite(13, !digitalRead(13));
    frequency = 0;
  }
}

ISR(INT0_vect)
{
  Serial.println(">>");
  frequency++;
}

ISR(INT1_vect)
{
  Serial.println("<<");
}
