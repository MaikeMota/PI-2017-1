/*
  ===============================================================================
                              EXTERNAL LIBRARIES
  ===============================================================================
*/

#include <avr/interrupt.h>
#include <avr/io.h>
#include <Ultrasonic.h>

/*
  ===============================================================================
                              TYPE DEFINITIONS
  ===============================================================================
*/

/*
  ===============================================================================
                              PROGRAM CONSTANTS
  ===============================================================================
*/
#define PRECISION 3
#define DEBUG

/*
  ===============================================================================
                              HARDWARE MAPPING
  ===============================================================================

  ** Ethernet Shield uses PINS 4, 10, 11 and 12
*/
#define STREET_WATER_FLUX_SENSOR 2
#define WATER_EXIT_FLUX_SENSOR 3
#define STREET_WATER_FLUX_LED 5
#define WATER_EXIT_FLUX_LED 6
#define STREET_WATER_SOLENOIDE 7
#define TRIGGER_PIN 8
#define ECHO_PIN 9

/*
  ===============================================================================
                              GLOBAL VARIABLES (INTERRUPTS)
  ===============================================================================
*/
volatile long streetWaterFrequency = 0;
volatile long waterExitFrequency = 0;

/*
  ===============================================================================
                              GLOBAL VARIABLES
  ===============================================================================
*/
float recipientRadius = 10;
float recipientHeight = 25.2;

float minWaterLevel = 0.0;
float minWaterHeight = 0.0;

float medWaterLevel = 0.0;
float medWaterHeight = 0.0;

float maxWaterLevel = 0.0;
float maxWaterHeight = 0.0;

long lastTime = 0;
long currentTime = 0;
float lastStreetWaterFlux = 0;
float lastWaterExitFlux = 0;
unsigned long lastCheck = 0;
unsigned long startedToFullFill = 0;
unsigned long startedToEmpty = 0;
Ultrasonic ultrasonic(TRIGGER_PIN, ECHO_PIN);

/*
  ===============================================================================
                              FUNCTIONS PROTOTYPES
  ===============================================================================
*/
float readWaterHeight();
float calculateActualWaterVolume();
float waterLevelToWaterHeight(float targetVolume);
void setMinWaterLevel(float targetVolume);
void setMedWaterLevel(float targetVolume);
void setMaxWaterLevel(float targetVolume);

void setup()
{
  pinMode(13, OUTPUT);
  pinMode(STREET_WATER_FLUX_SENSOR, INPUT); // Configures STREET_WATER_FLUX_SENSOR as Input
  pinMode(WATER_EXIT_FLUX_SENSOR, INPUT);   // Configures WATER_EXIT_FLUX_SENSOR as Input

  Serial.begin(9600);

  attachInterrupt(0, streetWaterFlowInterrupt, RISING); // Attachs streetWaterFlowInterrupt function to INT0
  attachInterrupt(1, waterExitFlowInterrupt, RISING);   // Attachs waterExitFlowInterrupt function to INT1
  sei();                                                // Enables interrupts

  setMinWaterLevel(1);
  setMedWaterLevel(3.5);
  setMaxWaterLevel(6);
}

void loop()
{

  if (millis() >= (lastCheck + 1000))
  {
    float actualVolume = calculateActualWaterVolume();
    float actualStreetWaterFlux = streetWaterFrequency / (7.5 * 60);
    float actualWaterExitFlux = waterExitFrequency / (7.5 * 60);
    streetWaterFrequency = 0;
    waterExitFrequency = 0;

#ifdef DEBUG
    Serial.print("Volume: ");
    Serial.print(actualVolume);
    Serial.print(" L");
    Serial.print(" Vazao Agua Rua: ");
    Serial.print(actualStreetWaterFlux, PRECISION); // Liters per second
    Serial.print(" l/s");
    Serial.print(" Vazao saida: ");
    Serial.print(actualWaterExitFlux, PRECISION); // Liters per second
    Serial.println(" l/s");
#endif

    if (lastStreetWaterFlux == 0 && actualStreetWaterFlux > 0)
    {
      digitalWrite(13, HIGH);
      startedToFullFill = millis();
//TODO SET STATUS
#ifdef DEBUG
      Serial.println("INICIO_FLUXO_AGUA_RUA");
#endif
    }
    else if (lastStreetWaterFlux > 0 && actualStreetWaterFlux == 0)
    {
      digitalWrite(13, LOW);
      long fullFillTime = (millis() - startedToFullFill) / 1000;
//TODO SET STATUS
#ifdef DEBUG
      Serial.println("FIM_FLUXO_AGUA_RUA");
      Serial.print("Enchido em: ");
      Serial.print(fullFillTime);
      Serial.println(" s");
      Serial.print(" Vazao Media: ");
#endif
    }

    lastStreetWaterFlux = actualStreetWaterFlux;

    if (lastWaterExitFlux == 0 && actualWaterExitFlux > 0)
    {
      digitalWrite(13, HIGH);
      startedToEmpty = millis();
//TODO SET STATUS
#ifdef DEBUG
      Serial.println("INICIO_FLUXO_SAIDA_AGUA");
#endif
    }
    else if (lastWaterExitFlux > 0 && actualWaterExitFlux == 0)
    {
      digitalWrite(13, LOW);
      long emptyTime = (millis() - startedToEmpty) / 1000;
//TODO SET STATUS
#ifdef DEBUG
      Serial.println("FIM_FLUXO_SAIDA_AGUA");
      Serial.print("Esvaziado em: ");
      Serial.print(emptyTime);
      Serial.println(" s");
#endif
    }

    lastWaterExitFlux = actualWaterExitFlux;
    lastCheck = millis();
  }
}

/*
  ===============================================================================
                              AUXILIARY FUNCTIONS
  ===============================================================================
*/
/**
* Calculates the actual water volume of the recipient in Liters.
* @returns float the current water volume (L).
*/
float calculateActualWaterVolume()
{
  float actualWaterHeight = readWaterHeight();
  float currentWaterVolume = (PI * pow(recipientRadius, 2) * (actualWaterHeight)); // V = PI * R^2 * H
                                                                                   // R and H are in CM
  currentWaterVolume = currentWaterVolume / 1000;                                  // Convert cm³ to L

#ifdef DEBUG
  Serial.print("actualWaterHeight: ");
  Serial.println(actualWaterHeight);
#endif
  return currentWaterVolume;
}

/**
* Read the distance sensor and returns the current height in CM.
* @returns float current water height.
*/
float readWaterHeight()
{
  long echoTiming = ultrasonic.timing();
  float cm = ultrasonic.convert(echoTiming, Ultrasonic::CM);
  cm = recipientHeight - cm;
  return cm;
}

float waterLevelToWaterHeight(float targetVolume)
{

  float waterHeight = targetVolume / (PI * pow(recipientRadius, 2)); // H = V / (PI * R ^ 2);
                                                                     // R and H are in CM
  waterHeight = waterHeight * 1000;                                  // Convert L to cm

  //waterHeight = recipientHeight - waterHeight; // Revert the Heigth ( Because the needed value is the distance of the sensor
                                               // [recipientHeight] and the waterHeight
  return waterHeight;
}

void setMinWaterLevel(float targetVolume)
{
  minWaterLevel = targetVolume;
  minWaterHeight = waterLevelToWaterHeight(minWaterLevel);
#ifdef DEBUG
  Serial.print("minWaterLevel: ");
  Serial.print(minWaterLevel, PRECISION);
  Serial.print(" minWaterHeight: ");
  Serial.println(minWaterHeight, PRECISION);
#endif
}

void setMedWaterLevel(float targetVolume)
{
  medWaterLevel = targetVolume;
  medWaterHeight = waterLevelToWaterHeight(medWaterLevel);
#ifdef DEBUG
  Serial.print("medWaterLevel: ");
  Serial.print(medWaterLevel, PRECISION);
  Serial.print(" medWaterHeight: ");
  Serial.println(medWaterHeight, PRECISION);
#endif
}

void setMaxWaterLevel(float targetVolume)
{
  maxWaterLevel = targetVolume;
  maxWaterHeight = waterLevelToWaterHeight(maxWaterLevel);
#ifdef DEBUG
  Serial.print("maxWaterLevel: ");
  Serial.print(maxWaterLevel, PRECISION);
  Serial.print(" maxWaterHeight: ");
  Serial.println(maxWaterHeight, PRECISION);
#endif
}

/*
  ===============================================================================
                              INTERRUPTION HANDLERS
  ===============================================================================
*/
void streetWaterFlowInterrupt()
{
  streetWaterFrequency++;
}
void waterExitFlowInterrupt()
{
  waterExitFrequency++;
}