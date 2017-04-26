#include <avr/interrupt.h>
#include <avr/io.h>

#include <Ultrasonic.h>

//#define DEBUG 1

#define PI 3.14159
#define PRECISION 3

#define TRIGGER_PIN 6
#define ECHO_PIN 7

volatile float radius = 10;
volatile float totalheight = 25.2;
volatile float mininumheight = 22.8;

volatile long streetWaterFrequency = 0;
volatile long waterExitFrequency = 0;
long lastTime = 0;
long currentTime = 0;

float lastStreetWaterFlux = 0;
float lastWaterExitFlux = 0;

Ultrasonic ultrasonic(TRIGGER_PIN, ECHO_PIN);

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
  Serial.print(radius);
  Serial.print(F(" Actual Height: "));
  Serial.print(actualheight);
  Serial.print(F(" Current Volume: "));
  Serial.println(currentVolume);
#endif                         // DEBUG
  return currentVolume / 1000; //convert to L
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
  Serial.print(F("Total Microseconds: "));
  Serial.print(microsec);
  Serial.print(F(" Current distance (cm): "));
  Serial.println(cm);
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
  attachInterrupt(0, streetWaterFlowInterrupt, RISING);
  attachInterrupt(1, waterExitFlowInterrupt, RISING);
  //EICRA = (1 << ISC11);// | (1 << ISC10); // Set INT0 and INT1 to interrupt at RISING
  /* Serial.println(ISC11, BIN);
  Serial.println(1 << ISC11, BIN);
  Serial.println(ISC10, BIN);
  Serial.println(1 << ISC10, BIN);
  Serial.println(ISC01, BIN);
  Serial.println(1 << ISC01, BIN);
  Serial.println(ISC00, BIN);
  Serial.println(1 << ISC00, BIN);*/
  //EIMSK |= (1 << INT0);// | (1 << INT1); // Turns on INT0 and INT1
  sei(); // Enable interrupts
}

long lastCheck = 0;

long startedToFullFill = 0;
long startedToEmpty = 0;

void loop()
{
  /*currentTime = millis();
  if (currentTime >= (lastTime + 1000))
  {
    lastTime = currentTime;
    //Serial.println(frequency / 7.5);
    digitalWrite(13, !digitalRead(13));
    frequency = 0;
  }*/

  if (millis() >= (lastCheck + 1000))
  {
    Serial.print("Volume: ");
    Serial.print(calculateWaterVolume(radius, readWaterHeight()), PRECISION);
    Serial.print(" L");
    Serial.print(" Vazao Agua Rua: ");
    float actualStreetWaterFlux = streetWaterFrequency / (7.5 * 60);

    Serial.print(actualStreetWaterFlux, PRECISION); // Liters per second
    streetWaterFrequency = 0;
    Serial.print(" l/s");
    Serial.print(" Vazao saida: ");

    float actualWaterExitFlux = waterExitFrequency / (7.5 * 60);
    Serial.print(actualWaterExitFlux, PRECISION); // Liters per second
    waterExitFrequency = 0;
    Serial.println(" l/s");

    if (lastStreetWaterFlux == 0 && actualStreetWaterFlux > 0)
    {
      digitalWrite(13, HIGH);
      Serial.println("INICIO_FLUXO_AGUA_RUA");
      startedToFullFill = millis();
    }
    else if (lastStreetWaterFlux > 0 && actualStreetWaterFlux == 0)
    {
      digitalWrite(13, LOW);
      Serial.println("FIM_FLUXO_AGUA_RUA");
      Serial.print("Enchido em: ");
      long fullFillTime = (millis() - startedToFullFill) / 1000;
      Serial.print(fullFillTime);
      Serial.print(" s");
      Serial.print(" Vazao Media: ");
      Serial.println((5 / fullFillTime), PRECISION); // TODO CHANGE TO VOL_MAX
      Serial.println(" l/s");
    }
    lastStreetWaterFlux = actualStreetWaterFlux;

    if (lastWaterExitFlux == 0 && actualWaterExitFlux > 0)
    {
      digitalWrite(13, HIGH);
      Serial.println("INICIO_FLUXO_SAIDA_AGUA");
      startedToEmpty = millis();
    }
    else if (lastWaterExitFlux > 0 && actualWaterExitFlux == 0)
    {
      digitalWrite(13, LOW);
      Serial.println("FIM_FLUXO_SAIDA_AGUA");
      Serial.print("Esvaziado em: ");
      long emptyTime = (millis() - startedToEmpty) / 1000;
      Serial.print(emptyTime);
      Serial.println(" s");
      Serial.print(" Vazao Media: ");
      Serial.print((5 / emptyTime), PRECISION); // TODO CHANGE TO VOL_MAX
      Serial.println(" l/s");
    }
    lastWaterExitFlux = actualWaterExitFlux;

    lastCheck = millis();
  }
}

void streetWaterFlowInterrupt()
{
  streetWaterFrequency++;
}
void waterExitFlowInterrupt()
{
  waterExitFrequency++;
}