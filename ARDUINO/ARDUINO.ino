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
  UNDER_MIN_VOLUME,
  UNDER_DEFINED_VOLUME
} OpenWaterInletTriggerEnum;

typedef enum {
  ABOVE_HALF_VOLUME,
  ABOVE_MED_VOLUME,
  ABOVE_MIN_VOLUME,
  ABOVE_DEFINED_VOLUME
} CloseWaterInletTriggerEnum;

typedef enum {
  WATER_INLET_FLUX_STARTED,
  WATER_INLET_FLUX_STOPED,
  WATER_OUT_FLUX_STARTED,
  WATER_OUT_FLUX_STOPED,
  WATER_INLET_OPEN_TRIGGERED,
  WATER_INLET_CLOSE_TRIGGERED
} Event;

/*
  ===============================================================================
                              PROGRAM CONSTANTS
  ===============================================================================
*/

//#define DEBUG

#define PRECISION 3
#define MAX_EVENTS 5

#define DEVICE_DATA_ENDPOINT "/api/device/data/Iv0m6fsfZ9fkt31t8nO22D8wP "
#define DEVICE_CONFIGURATION_ENDPOINT "/api/device/config/Iv0m6fsfZ9fkt31t8nO22D8wP "

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
#define WATER_INLET_FLUX_SENSOR 2
#define WATER_OUT_FLUX_SENSOR 3
#define WATER_INLET_SOLENOIDE 7
#define TRIGGER_PIN 8
#define ECHO_PIN 9

/*
  ===============================================================================
                              GLOBAL VARIABLES (INTERRUPTS)
  ===============================================================================
*/
volatile long waterInletFequency = 0;
volatile long waterOutFrequency = 0;

/*
  ===============================================================================
                              GLOBAL VARIABLES
  ===============================================================================
*/


unsigned int checkInterval = 1000; //Default Check Interval
unsigned long lastCheckAt = 0;

OpenWaterInletTriggerEnum openWaterInletTrigger;
CloseWaterInletTriggerEnum closeWaterInletTrigger;

float openWaterInletUnderLevel = 0;
float closeWaterInletAboveLevel = 0;

bool isWaterInletOpen = false;

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
RestClient client = RestClient("ec2-52-67-34-249.sa-east-1.compute.amazonaws.com", 80);

String response = "";

/*
  ===============================================================================
                              FUNCTIONS PROTOTYPES
  ===============================================================================
*/
float readWaterHeight();
float calculateActualWaterLevel();
float waterLevelToWaterHeight(float targetLevel);
void setRecipientRadius(float radius);
void setRecipientHeight(float height);
void setMinWaterLevel(float targetLevel);
void setMedWaterLevel(float targetLevel);
void setMaxWaterLevel(float targetLevel);
void setOpenWaterInletTrigger(OpenWaterInletTriggerEnum trigger);
void setCloseWaterInletTrigger(CloseWaterInletTriggerEnum trigger);
void setOpenWaterInletUnderLevel(float level);
void setCloseStreetWaterAboveLevel(float level);
void checkStreetWaterInletTrigger();
void openStreetWater();
void closeStreetWater();
void addEvent(Event event);
void resetEvents();
void configureDevice(String* data);
char* produceDataToSend();

void setup()
{
  pinMode(13, OUTPUT);
  pinMode(WATER_INLET_FLUX_SENSOR, INPUT); // Configures WATER_INLET_FLUX_SENSOR as Input
  pinMode(WATER_OUT_FLUX_SENSOR, INPUT);   // Configures WATER_OUT_FLUX_SENSOR as Input
  pinMode(WATER_INLET_SOLENOIDE, OUTPUT);  // Configure WATER_INLET_SOLENOIDE as Output

  Serial.begin(9600);

  attachInterrupt(0, streetWaterFlowInterrupt, RISING); // Attachs streetWaterFlowInterrupt function to INT0
  attachInterrupt(1, waterExitFlowInterrupt, RISING);   // Attachs waterExitFlowInterrupt function to INT1
  sei();                                                // Enables interrupts


  client.dhcp();
  delay(1500);
  client.setContentType("application/json");
#ifdef DEBUG
  Serial.println(F("Connected to network"));
#endif
  Serial.println("Conectando ao servidor...");
      
  int statusCode = client.get(DEVICE_CONFIGURATION_ENDPOINT, &response);
    if(statusCode != 200){ 
        Serial.println("Erro ao Recuperar configurações do dispositivo.");
      while(true){
      }
    }
  configureDevice(&response);
}

void loop()
{

  if (millis() >= (lastCheckAt + checkInterval))
  {
    cli();
    float actualWaterLevel = calculateActualWaterLevel();
    float actualWaterInletFlux = waterInletFequency/ 5.5;
    float actualWaterOutFlux = waterOutFrequency / 5.5;
    waterInletFequency = 0;
    waterOutFrequency = 0;

#ifdef DEBUG
    Serial.print(F("Volume: "));
    Serial.print(actualWaterLevel);
    Serial.print(" L");
    Serial.print(F(" Vazao Agua Rua: "));
    Serial.print(actualWaterInletFlux, PRECISION); // Liters per second
    Serial.print(" l/m");
    Serial.print(F(" Vazao saida: "));
    Serial.print(actualWaterOutFlux, PRECISION); // Liters per second
    Serial.println(F(" l/m"));
#endif

    if (lastStreetWaterInletFlux == 0 && actualWaterInletFlux > 0)
    {
      digitalWrite(13, HIGH);
      addEvent(WATER_INLET_FLUX_STARTED);
#ifdef DEBUG
      Serial.println(F("WATER_INLET_FLUX_STARTED"));
#endif
    }
    else if (lastStreetWaterInletFlux > 0 && actualWaterInletFlux == 0)
    {
      digitalWrite(13, LOW);
      addEvent(WATER_INLET_FLUX_STOPED);
#ifdef DEBUG
      Serial.println(F("WATER_INLET_FLUX_STOPED"));
#endif
    }

    if (lastWaterOutFlux == 0 && actualWaterOutFlux > 0)
    {
      digitalWrite(13, HIGH);
      addEvent(WATER_OUT_FLUX_STARTED);
#ifdef DEBUG
      Serial.println(F("WATER_OUT_FLUX_STARTED"));
#endif
    }
    else if (lastWaterOutFlux > 0 && actualWaterOutFlux == 0)
    {
      digitalWrite(13, LOW);
      long emptyTime = (millis() - startedToEmpty) / 1000;
      addEvent(WATER_OUT_FLUX_STOPED);
#ifdef DEBUG
      Serial.println(F("WATER_OUT_FLUX_STOPED"));
#endif
    }

    lastStreetWaterInletFlux = actualWaterInletFlux;
    lastWaterOutFlux = actualWaterOutFlux;
    lastWaterLevel = actualWaterLevel;
    checkStreetWaterInletTrigger();
    char *data = produceDataToSend();
    int statusCode = client.post(DEVICE_DATA_ENDPOINT, data, &response); //TODO APPEND STRINGS
#ifdef DEBUG
    Serial.print(F("Status code from server: "));
    Serial.println(statusCode);
    Serial.print(F("Response body from server: "));
    Serial.println(response);
#endif
    response = "";
    resetEvents();
    lastCheckAt = millis();
    sei();
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
float calculateActualWaterLevel()
{
  float actualWaterHeight = readWaterHeight();
  float currentWaterVolume = (PI * pow(recipientRadius, 2) * (actualWaterHeight)); // V = PI * R^2 * H
                                                                                   // R and H are in CM
  currentWaterVolume = currentWaterVolume / 1000;                                  // Convert cm³ to L

#ifdef DEBUG
  Serial.print(F("PI * "));
  Serial.print(recipientRadius, PRECISION);  
  Serial.print(F("^2 * "));
  Serial.print(actualWaterHeight, PRECISION);  
  Serial.print(F(" = "));
  Serial.println(currentWaterVolume, PRECISION);  
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
  float value = ultrasonic.convert(echoTiming, Ultrasonic::CM);
  float cm = recipientHeight - value;
  #ifdef DEBUG  
  Serial.print(recipientHeight, PRECISION);  
  Serial.print(F(" - "));
  Serial.print(value, PRECISION);  
  Serial.print(F(" = "));
  Serial.println(cm, PRECISION);
  #endif
  return cm;
}

float waterLevelToWaterHeight(float targetLevel)
{

  float waterHeight = targetLevel / (PI * pow(recipientRadius, 2)); // H = V / (PI * R ^ 2);
                                                                     // R and H are in CM
  waterHeight = waterHeight * 1000;                                  // Convert L to cm

  //waterHeight = recipientHeight - waterHeight; // Revert the Heigth ( Because the needed value is the distance of the sensor
  // [recipientHeight] and the waterHeight
  return waterHeight;
}


void setRecipientRadius(float radius) {
  recipientRadius = radius;
#ifdef DEBUG
  Serial.print(F("recipientRadius: "));
  Serial.println(recipientRadius, PRECISION);
#endif
}

void setRecipientHeight(float height){
  recipientHeight = height;
#ifdef DEBUG
  Serial.print(F("recipientHeight: "));
  Serial.println(recipientHeight, PRECISION);
#endif
}

void setMinWaterLevel(float targetLevel)
{
  minWaterLevel = targetLevel;
  minWaterHeight = waterLevelToWaterHeight(minWaterLevel);
#ifdef DEBUG
  Serial.print(F("minWaterLevel: "));
  Serial.println(minWaterLevel, PRECISION);
  Serial.print(F("minWaterHeight: "));
  Serial.println(minWaterHeight, PRECISION);
#endif
}

void setMedWaterLevel(float targetLevel)
{
  medWaterLevel = targetLevel;
  medWaterHeight = waterLevelToWaterHeight(medWaterLevel);
#ifdef DEBUG
  Serial.print(F("medWaterLevel: "));
  Serial.println(medWaterLevel, PRECISION);
  Serial.print(F("medWaterHeight: "));
  Serial.println(medWaterHeight, PRECISION);
#endif
}

void setMaxWaterLevel(float targetLevel)
{
  maxWaterLevel = targetLevel;
  maxWaterHeight = waterLevelToWaterHeight(maxWaterLevel);
#ifdef DEBUG
  Serial.print(F("maxWaterLevel: "));
  Serial.println(maxWaterLevel, PRECISION);
  Serial.print(F("maxWaterHeight: "));
  Serial.println(maxWaterHeight, PRECISION);
#endif
}

void setOpenWaterInletTrigger(OpenWaterInletTriggerEnum trigger)
{  
  openWaterInletTrigger = trigger;
#ifdef DEBUG
  Serial.print(F("openWaterInletTrigger: "));
  Serial.println(openWaterInletTrigger);
#endif
}

void setCloseWaterInletTrigger(CloseWaterInletTriggerEnum trigger)
{
  closeWaterInletTrigger = trigger;
#ifdef DEBUG
  Serial.print(F("closeWaterInletTrigger: "));
  Serial.println(closeWaterInletTrigger);
#endif
}

void checkStreetWaterInletTrigger()
{
  if (!isWaterInletOpen)
  {
    switch (openWaterInletTrigger)
    {

    case UNDER_DEFINED_VOLUME:
    {
      if (lastWaterLevel <= openWaterInletUnderLevel)
      {
        openStreetWater();
      }
      break;
    }
    case UNDER_HALF_VOLUME:
    {
      if (lastWaterLevel < ((maxWaterLevel - minWaterLevel) / 2)) // util volume
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
    case UNDER_MIN_VOLUME:
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
    switch (closeWaterInletTrigger)
    {
    case ABOVE_DEFINED_VOLUME:
    {
      if (lastWaterLevel >= closeWaterInletAboveLevel)
      {
        closeStreetWater();
      }
      break;
    }
    case ABOVE_HALF_VOLUME:
    {
      if (lastWaterLevel > ((maxWaterLevel - minWaterLevel) / 2)) // util volume
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
    case ABOVE_MIN_VOLUME:
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

void setOpenWaterInletUnderLevel(float level)
{
  openWaterInletUnderLevel = level;
#ifdef DEBUG
  Serial.print(F("openWaterInletUnderLevel: "));
  Serial.println(openWaterInletUnderLevel, PRECISION);
#endif
}

void setCloseStreetWaterAboveLevel(float level)
{
  closeWaterInletAboveLevel = level;
#ifdef DEBUG
  Serial.print(F("closeWaterInletAboveLevel: "));
  Serial.println(closeWaterInletAboveLevel, PRECISION);
#endif
}

void openStreetWater()
{
  digitalWrite(WATER_INLET_SOLENOIDE, HIGH);
  isWaterInletOpen = true;
  addEvent(WATER_INLET_OPEN_TRIGGERED);
#ifdef DEBUG
  Serial.println(F("WATER_INLET_OPEN_TRIGGERED"));
#endif
}

void closeStreetWater()
{
  digitalWrite(WATER_INLET_SOLENOIDE, LOW);
  isWaterInletOpen = false;
  addEvent(WATER_INLET_CLOSE_TRIGGERED);
#ifdef DEBUG
  Serial.println(F("WATER_INLET_CLOSE_TRIGGERED"));
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

void configureDevice(String* data){
  int start = 0;
  int end = data->indexOf(',') + 1; 
  setMinWaterLevel(data->substring(start, end).toFloat());
  data->remove(start, (end - start));
  end = data->indexOf(',') + 1;
  setMedWaterLevel(data->substring(start, end).toFloat());
  data->remove(start, (end - start));
  end = data->indexOf(',') + 1;
  setMaxWaterLevel(data->substring(start, end).toFloat());  
  data->remove(start, (end - start));
  end = data->indexOf(',') + 1;
  setRecipientRadius(data->substring(start, end).toFloat());
  data->remove(start, (end - start));
  end = data->indexOf(',') + 1;
  setRecipientHeight(data->substring(start, end).toFloat());
  data->remove(start, (end - start));
  end = data->indexOf(',') + 1;
  setOpenWaterInletUnderLevel(data->substring(start, end).toFloat());  
  data->remove(start, (end - start));
  end = data->indexOf(',') + 1;
  setCloseStreetWaterAboveLevel(data->substring(start, end).toFloat());
  data->remove(start, (end - start));
  end = data->indexOf(',') + 1;
  setOpenWaterInletTrigger(data->substring(start, end).toInt());
  data->remove(start, (end - start));
  end = data->length();
  setCloseWaterInletTrigger(data->substring(start, end).toInt());
  *data = "";

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
  waterInletFequency++;
}
void waterExitFlowInterrupt()
{
  waterOutFrequency++;
}