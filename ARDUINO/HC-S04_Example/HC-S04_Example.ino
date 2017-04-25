//Programa: Conectando Sensor Ultrassonico HC-SR04 ao Arduino
//Autor: FILIPEFLOP
 
//Carrega a biblioteca do sensor ultrassonico
#include <Ultrasonic.h>

#define PI 3.14159
#define R 10
#define H_MAX 25.2
#define H_MIN 22.8
 
//Define os pinos para o trigger e echo
#define pino_trigger 4
#define pino_echo 5
 
//Inicializa o sensor nos pinos definidos acima
Ultrasonic ultrasonic(pino_trigger, pino_echo);

float H_ATUAL = 0; 
 
void setup()
{
  Serial.begin(9600);
}

int estado_atual = -1;
void loop()
{
  float volume = 0,  cmMsec = 0;
  long microsec = 0;
  microsec = ultrasonic.timing();
  cmMsec += ultrasonic.convert(microsec, Ultrasonic::CM);
  H_ATUAL = H_MAX - cmMsec;
  volume = PI * pow(R, 2) * H_ATUAL;
  volume /= 1000;

  if(volume < 1 && estado_atual != 0) {
    Serial.println("ABAIXO DO MINIMO");
    estado_atual = 0;
  }else if(volume <= 3.5 && estado_atual != 1){
    Serial.println("ABAIXO DO MEDIO");
    estado_atual = 1;
  }else if(volume > 3.5 && volume < 6 && estado_atual != 2){
    Serial.println("ACIMA DO MEDIO");
    estado_atual = 2;
  }else if(volume >= 6 && estado_atual != 3){
    Serial.println("MAXIMO");
    estado_atual = 3;
  }
  Serial.print("V: "); Serial.println(volume);
  delay(500);
}
