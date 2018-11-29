#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <string.h>
#include <netinet/in.h>

#define PORT 8080

int main(){
  // --- Creating a TCP/IP socket
  int server_fd = socket(AF_INET, SOCK_STREAM, 0);

  if(server_fd < 0){
    perror("no socket!");
    exit(EXIT_FAILURE);
  }

  // --- Binding the socket to an IP & port
  struct sockaddr_in address;

  // Empties the address struct
  memset((char*) &address, '\0', sizeof(address));
  // Address family
  address.sin_family = AF_INET;
  // Address for socket (IP)
  address.sin_addr.s_addr = htonl(INADDR_ANY);
  // Transport address (port)
  address.sin_port = htons(PORT);

  int addrlen = sizeof(address);
  if(bind(server_fd, (struct sockaddr *) &address, addrlen) < 0){
    perror("unable to bind socket!");
    exit(EXIT_FAILURE);
  }

  // -- Configuring for listening requests
  if(listen(server_fd, 3) < 0){
    perror("listening");
    exit(EXIT_FAILURE);
  }

  while(1){
    // accept grabs first request on queue set up in listen and creates a new socket with the
    // same connection
    // this blocks until a connection is present
    int new_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen);

    if(new_socket<0){
	perror("Accepting");
	exit(EXIT_FAILURE);
    }

    char buffer[1024] = {0};

    long valread = read(new_socket, buffer, 1024);
    printf("%s\n", buffer);
    if(valread<0){
	printf("no bytes to read");
    }
    char *hi = "HTTP/1.1 200 OK\nContent-Type: text/html\nContent-Length: 12\n\n<h1>hey yo!</h1>";
    write(new_socket, hi, strlen(hi));
    close(new_socket);
  }

  return 0;
}
