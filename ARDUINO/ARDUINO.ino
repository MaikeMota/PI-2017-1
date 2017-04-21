#include <avr/interrupt.h> 
#include <avr/io.h>

volatile long frequency = 0;
long lastTime = 0;
long currentTime = 0;

void setup() {
  pinMode(13, OUTPUT);
  pinMode(2, INPUT);
  pinMode(3, INPUT);
  Serial.begin(9600);
  EICRA = (1 << ISC11) | (1 << ISC10);
  Serial.println(ISC11, BIN);
  Serial.println(1 << ISC11, BIN);
  Serial.println(ISC10, BIN);
  Serial.println(1<<ISC10, BIN);
  Serial.println(ISC01, BIN);
  Serial.println(1<<ISC01, BIN);
  Serial.println(ISC00, BIN);
  Serial.println(1<<ISC00, BIN);
  EIMSK |= (1 << INT0) | (1 << INT1);     // Turns on INT0 and INT1
  sei();
}

void loop() {
  currentTime = millis();
  if(currentTime >= (lastTime + 1000)){
    lastTime = currentTime;
    //Serial.println(frequency / 7.5);
    digitalWrite(13, !digitalRead(13));
    frequency = 0;
  }
}

ISR(INT0_vect){
  Serial.println(">>");
  frequency++;
}

ISR(INT1_vect){ 
  Serial.println("<<");
}

