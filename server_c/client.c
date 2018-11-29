#include <stdio.h>
#include <sys/socket.h>
#include <stdlib.h>
#include <unistd.h>
#include <netinet/in.h>
#include <string.h>
#include <arpa/inet.h>

#define PORT 8080

int main(){
  int sock = 0;
  long valread;
  struct sockaddr_in serv_addr;
  char *hi = "hola";
  char buffer[1024] = {0};
  if((sock=socket(AF_INET, SOCK_STREAM, 0))<0){
    printf("Socket not created");
    return -1;
  }
  memset(&serv_addr, '\0', sizeof(serv_addr));
  serv_addr.sin_family = AF_INET;
  serv_addr.sin_port = htons(PORT);

  if(inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr)<=0){
    printf("invalid address");
    return -1;
  }
  if(connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr))<0){
    printf("Connection failed");
    return -1;
  }
  send(sock, hi, strlen(hi), 0);
  valread = read(sock, buffer, 1024);
  printf("%s", buffer);
  return 0;
}
