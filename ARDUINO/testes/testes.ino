#include <LiquidCrystal.h>

LiquidCrystal lcd(8, 9, 4, 5, 6, 7);   


/*
Código exemplo de uso para o medidor de fluxo de água YF-s201
*/

volatile int  flow_frequency;
unsigned int  l_hour;        //Litros por hora
unsigned char flowmeter = 2; //Número do pino do Arduino conectado à saída do sensor
unsigned long currentTime;
unsigned long cloopTime;
unsigned long counter =0;

void flow ()//Interrupção para calculo dos litros por hora
  { 
    Serial.println(flow_frequency++);
  } 

void setup()
  { 
   lcd.begin(16, 2);   
  pinMode(flowmeter, INPUT);
  Serial.begin(9600); 
  attachInterrupt(0, flow, RISING); //Configura a interrupção externa pelo pino de entrada
                                     // Veja o link para mais detalhes http://arduino.cc/en/Reference/attachInterrupt
  sei();                            // Habilita a interrupção 
  currentTime = millis();
  cloopTime = currentTime;
  } 

void loop ()    
  {
  currentTime = millis();
  //A cada segundo, calcula e mostra na serial o valor litros por hora
   if(currentTime >= (cloopTime + 1000))
     {     
       cloopTime = currentTime;
       // Frequência dos pulsos (Hz) = 7.5Q, Q é o fluxo em L/min. (Resulta em +/- 3% de precisão)
       l_hour = (flow_frequency / 7.5); // (Frequência dos pulsos x 60 min) / 7.5Q = Fluxo em L/hora
       flow_frequency = 0;                   // Reinicia o contador
       lcd.setCursor(0,0);   
       lcd.println("                ");              // Reinicia o contador
       lcd.setCursor(0,0);
       lcd.print(l_hour, DEC);       // Envia pela porta serial o valor
       lcd.setCursor(0,1);
       lcd.println(" L/s");
     }

      while(true){
        Serial.println("PRESO!");
      }
}
