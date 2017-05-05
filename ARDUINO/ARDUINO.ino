/*
  ===============================================================================
                              EXTERNAL LIBRARIES
  ===============================================================================
*/

#include <Ultrasonic.h>
#include <Ethernet.h>
#include <SPI.h>
#include <RestClient.h>

/*
  ===============================================================================
                              TYPE DEFINITIONS
  ===============================================================================
*/

typedef enum {
  UNDER_HALF_VOLUME,
  UNDER_MED_VOLUME,
  UNDER_MIN_VOUME,
  UNDER_DEFINID_VOLUME
} OpenStreetWaterTriggerEnum;

typedef enum {
  ABOVE_HALF_VOLUME,
  ABOVE_MED_VOLUME,
  ABOVE_MIN_VOUME,
  ABOVE_DEFINID_VOLUME
} CloseStreetWaterTriggerEnum;

typedef enum {
  WATER_INLET_FLUX_STARTED,
  WATER_INLET_FLUX_STOPED,
  WATER_OUT_FLUX_STARTED,
  WATER_OUT_FLUX_STOPED,
  WATER_INLET_TRIGGERED,
  WATER_OUT_TRIGGERED
} Event;

/*
  ===============================================================================
                              PROGRAM CONSTANTS
  ===============================================================================
*/
#define PRECISION 3
#define DEBUG
#define MAX_EVENTS 5

/*
  ===============================================================================
                              HARDWARE MAPPING
  ===============================================================================

  ** Ethernet Shield Notes
      Arduino communicates with both the W5100 and SD card using the SPI bus (through the ICSP header).
      This is on D11, D12, and D13 on "classic" format Arduino models such as the Duemilanove,
        and pins D50, D51, and D52 on the Arduino Mega.

      D10 is used to select the W5100 and cannot be used for general I/O.
      D4 is used for the SD card and can only be used for general I/O if the SD slot is not occupied.
*/
#define STREET_WATER_FLUX_SENSOR 2
#define WATER_EXIT_FLUX_SENSOR 3
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

String DEVICE_KEY("{DEVICE_KEY}");

String DEVICE_DATA_ENDPOINT("/api/device/data/");
String DEVICE_CONFIGURATION_ENDPOINT("/api/device/config");

unsigned int checkInterval = 1000; //Default Check Interval
unsigned long lastCheckAt = 0;

OpenStreetWaterTriggerEnum openStreetWaterTrigger;
CloseStreetWaterTriggerEnum closeStreetWaterTrigger;

float openStreetWaterUnderLevel = 0;
float closeStreetWaterAboveLevel = 0;

bool isStreetWaterOpen = false;

float recipientRadius = 10;
float recipientHeight = 25.2;

float minWaterLevel = 0.0;
float minWaterHeight = 0.0;

float medWaterLevel = 0.0;
float medWaterHeight = 0.0;

float maxWaterLevel = 0.0;
float maxWaterHeight = 0.0;

float lastWaterLevel = 0;

long lastTime = 0;

float lastStreetWaterInletFlux = 0;
float lastWaterOutFlux = 0;

unsigned long startedToFullFill = 0;
unsigned long startedToEmpty = 0;

Event events[MAX_EVENTS];
int eventsPosition = 0;

Ultrasonic ultrasonic(TRIGGER_PIN, ECHO_PIN);
RestClient client = RestClient("192.168.0.5", 3000);

/*
  ===============================================================================
                              FUNCTIONS PROTOTYPES
  ===============================================================================
*/
float readWaterHeight();
float calculateactualWaterLevel();
float waterLevelToWaterHeight(float targetVolume);
void setMinWaterLevel(float targetVolume);
void setMedWaterLevel(float targetVolume);
void setMaxWaterLevel(float targetVolume);
void setOpenStreetWaterTrigger(OpenStreetWaterTriggerEnum trigger);
void setCloseStreetWaterTrigger(CloseStreetWaterTriggerEnum trigger);
void setOpenStreetWaterUnderLevel(float level);
void setCloseStreetWaterUnderLevel(float level);
void checkStreetWaterTrigger();
void openStreetWater();
void closeStreetWater();
void addEvent(Event event);
void resetEvents();
char* produceDataToSend();

void setup()
{
  pinMode(13, OUTPUT);
  pinMode(STREET_WATER_FLUX_SENSOR, INPUT); // Configures STREET_WATER_FLUX_SENSOR as Input
  pinMode(WATER_EXIT_FLUX_SENSOR, INPUT);   // Configures WATER_EXIT_FLUX_SENSOR as Input
  pinMode(STREET_WATER_SOLENOIDE, OUTPUT);  // Configure STREET_WATER_SOLENOIDE as Output

  Serial.begin(9600);

  attachInterrupt(0, streetWaterFlowInterrupt, RISING); // Attachs streetWaterFlowInterrupt function to INT0
  attachInterrupt(1, waterExitFlowInterrupt, RISING);   // Attachs waterExitFlowInterrupt function to INT1
  sei();                                                // Enables interrupts

  setMinWaterLevel(1.5);
  setMedWaterLevel(4);
  setMaxWaterLevel(6);

  setOpenStreetWaterTrigger(UNDER_HALF_VOLUME);
  setCloseStreetWaterTrigger(ABOVE_HALF_VOLUME);
  setOpenStreetWaterUnderLevel(2);
  setCloseStreetWaterUnderLevel(4);

#ifdef DEBUG
  Serial.println(F("Connect to network"));
#endif
  client.dhcp();
  client.setContentType("application/json");
}

String response = "";
void loop()
{

  if (millis() >= (lastCheckAt + checkInterval))
  {
    float actualWaterLevel = calculateactualWaterLevel();
    float actualStreetWaterFlux = streetWaterFrequency / (7.5 * 60);
    float actualWaterExitFlux = waterExitFrequency / (7.5 * 60);
    streetWaterFrequency = 0;
    waterExitFrequency = 0;

#ifdef DEBUG
    Serial.print(F("Volume: "));
    Serial.print(actualWaterLevel);
    Serial.print(" L");
    Serial.print(F(" Vazao Agua Rua: "));
    Serial.print(actualStreetWaterFlux, PRECISION); // Liters per second
    Serial.print(" l/s");
    Serial.print(F(" Vazao saida: "));
    Serial.print(actualWaterExitFlux, PRECISION); // Liters per second
    Serial.println(F(" l/s"));
#endif

    if (lastStreetWaterInletFlux == 0 && actualStreetWaterFlux > 0)
    {
      digitalWrite(13, HIGH);
      startedToFullFill = millis();
      addEvent(WATER_INLET_FLUX_STARTED);
#ifdef DEBUG
      Serial.println(F("WATER_INLET_FLUX_STARTED"));
#endif
    }
    else if (lastStreetWaterInletFlux > 0 && actualStreetWaterFlux == 0)
    {
      digitalWrite(13, LOW);
      long fullFillTime = (millis() - startedToFullFill) / 1000;
      addEvent(WATER_INLET_FLUX_STOPED);
#ifdef DEBUG
      Serial.println(F("WATER_INLET_FLUX_STOPED"));
      Serial.print(F("Enchido em: "));
      Serial.print(fullFillTime);
      Serial.println(" s");
      Serial.print(F(" Vazao Media: "));
#endif
    }


    if (lastWaterOutFlux == 0 && actualWaterExitFlux > 0)
    {
      digitalWrite(13, HIGH);
      startedToEmpty = millis();
      addEvent(WATER_OUT_FLUX_STARTED);
#ifdef DEBUG
      Serial.println(F("WATER_OUT_FLUX_STARTED"));
#endif
    }
    else if (lastWaterOutFlux > 0 && actualWaterExitFlux == 0)
    {
      digitalWrite(13, LOW);
      long emptyTime = (millis() - startedToEmpty) / 1000;
      addEvent(WATER_OUT_FLUX_STOPED);
#ifdef DEBUG
      Serial.println(F("WATER_OUT_FLUX_STOPED"));
      Serial.print(F("Esvaziado em: "));
      Serial.print(emptyTime);
      Serial.println(F(" s"));
#endif
    }

    lastStreetWaterInletFlux = actualStreetWaterFlux;
    lastWaterOutFlux = actualWaterExitFlux;
    lastWaterLevel = actualWaterLevel;
    checkStreetWaterTrigger();
    char *data = produceDataToSend();
    int statusCode = client.post("", data, &response); //TODO APPEND STRINGS
#ifdef DEBUG
    Serial.print(F("Status code from server: "));
    Serial.println(statusCode);
    Serial.print(F("Response body from server: "));
    Serial.println(response);
#endif
    response = "";
    resetEvents();
    lastCheckAt = millis();
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
float calculateactualWaterLevel()
{
  float actualWaterHeight = readWaterHeight();
  float currentWaterVolume = (PI * pow(recipientRadius, 2) * (actualWaterHeight)); // V = PI * R^2 * H
                                                                                   // R and H are in CM
  currentWaterVolume = currentWaterVolume / 1000;                                  // Convert cm³ to L

#ifdef DEBUG
  Serial.print(F("actualWaterHeight: "));
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
  Serial.print(F("minWaterLevel: "));
  Serial.print(minWaterLevel, PRECISION);
  Serial.print(F(" minWaterHeight: "));
  Serial.println(minWaterHeight, PRECISION);
#endif
}

void setMedWaterLevel(float targetVolume)
{
  medWaterLevel = targetVolume;
  medWaterHeight = waterLevelToWaterHeight(medWaterLevel);
#ifdef DEBUG
  Serial.print(F("medWaterLevel: "));
  Serial.print(medWaterLevel, PRECISION);
  Serial.print(F(" medWaterHeight: "));
  Serial.println(medWaterHeight, PRECISION);
#endif
}

void setMaxWaterLevel(float targetVolume)
{
  maxWaterLevel = targetVolume;
  maxWaterHeight = waterLevelToWaterHeight(maxWaterLevel);
#ifdef DEBUG
  Serial.print(F("maxWaterLevel: "));
  Serial.print(maxWaterLevel, PRECISION);
  Serial.print(F(" maxWaterHeight: "));
  Serial.println(maxWaterHeight, PRECISION);
#endif
}

void setOpenStreetWaterTrigger(OpenStreetWaterTriggerEnum trigger)
{
  openStreetWaterTrigger = trigger;
}

void setCloseStreetWaterTrigger(CloseStreetWaterTriggerEnum trigger)
{
  closeStreetWaterTrigger = trigger;
}

void checkStreetWaterTrigger()
{
  if (!isStreetWaterOpen)
  {
    switch (openStreetWaterTrigger)
    {

    case UNDER_DEFINID_VOLUME:
    {
      if (lastWaterLevel <= openStreetWaterUnderLevel)
      {
        openStreetWater();
      }
      break;
    }
    case UNDER_HALF_VOLUME:
    {
      if (lastWaterLevel < (maxWaterLevel / 2))
      {
        openStreetWater();
      }
      break;
    }
    case UNDER_MED_VOLUME:
    {
      if (lastWaterLevel < medWaterLevel)
      {
        openStreetWater();
      }
      break;
    }
    case UNDER_MIN_VOUME:
    {
      if (lastWaterLevel <= minWaterLevel)
      {
        openStreetWater();
      }
      break;
    }
    }
  }
  else
  {
    switch (closeStreetWaterTrigger)
    {
    case ABOVE_DEFINID_VOLUME:
    {
      if (lastWaterLevel >= closeStreetWaterAboveLevel)
      {
        closeStreetWater();
      }
      break;
    }
    case ABOVE_HALF_VOLUME:
    {
      if (lastWaterLevel > (maxWaterLevel / 2))
      {
        closeStreetWater();
      }
      break;
    }
    case ABOVE_MED_VOLUME:
    {
      if (lastWaterLevel > medWaterLevel)
      {
        closeStreetWater();
      }
      break;
    }
    case ABOVE_MIN_VOUME:
    {
      if (lastWaterLevel > minWaterLevel)
      {
        closeStreetWater();
      }
      break;
    }
    }
  }
}

void setOpenStreetWaterUnderLevel(float level)
{
  openStreetWaterUnderLevel = level;
}
void setCloseStreetWaterUnderLevel(float level)
{
  closeStreetWaterAboveLevel = level;
}

void openStreetWater()
{
  digitalWrite(STREET_WATER_SOLENOIDE, HIGH);
  isStreetWaterOpen = true;
  addEvent(WATER_INLET_TRIGGERED);
#ifdef DEBUG
  Serial.println(F("WATER_INLET_TRIGGERED"));
#endif
}

void closeStreetWater()
{
  digitalWrite(STREET_WATER_SOLENOIDE, LOW);
  isStreetWaterOpen = false;
  addEvent(WATER_OUT_TRIGGERED);
#ifdef DEBUG
  Serial.println(F("WATER_OUT_TRIGGERED"));
#endif
}

void addEvent(Event event)
{
  if (eventsPosition != MAX_EVENTS - 1)
  {
    events[eventsPosition++] = event;
  }
}

void resetEvents()
{
  for (int i = 0; i <= eventsPosition; i++)
  {
    events[i] = NULL;
  }
  eventsPosition = 0;
}

char* produceDataToSend()
{
  String data = "";
  char fBuffer[15];
  dtostrf(lastWaterLevel, 1, PRECISION, fBuffer);
  data += "{\"waterLevel\":\"" + String(fBuffer);
  dtostrf(lastStreetWaterInletFlux, 1, PRECISION, fBuffer);
  data += "\",\"waterInletFlux\":\"" + String(fBuffer);
  dtostrf(lastWaterOutFlux, 1, PRECISION, fBuffer);
  data += "\",\"waterOutFlux\":\"" + String(fBuffer) + "\"";
  if (eventsPosition > 0)
  {
    data += ",\"events\": [";
    for (int i = 0; i < eventsPosition; i++)
    {
      data += events[i];
      if (i == eventsPosition - 1)
      {
        data += ']';
      }
      else
      {
        data += ',';
      }
    }
  }
  data += '}';
  char dataToReturn[250];
  data.toCharArray(dataToReturn, 250);
  return dataToReturn;
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