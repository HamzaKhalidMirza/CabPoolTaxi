import { AuthService } from './../../core/auth.service';
import { Injectable } from '@angular/core';
import { SocketIo } from 'ng-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatSocket {
    
  constructor(
    private socket: SocketIo,
    private authService: AuthService
  ) { }

  sendMessage(data): Observable<any> {
      this.socket.emit('clientSendMessage', data);
      
      const chatMessageObs = Observable.create((observable) => {
        this.authService.getTokenFromStorage()
          .then(token => {
            const decodedToken = this.authService.getDecodedAccessToken(token);
            const chatMessageEvent = decodedToken.id + '-clientMessageSuccessfullySent';
            
            this.socket.on(chatMessageEvent, (data) => {
              observable.next(data);
            });  
          });
      });
  
      return chatMessageObs;
  }
  
  receivedMessage(): Observable<any> {

    const chatMessageObs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);
        const chatMessageEvent =
          decodedToken.id + "-clientReceivedMessage";

          this.socket.on(chatMessageEvent, (data) => {
          observable.next(data);
        });
      });
    });

    return chatMessageObs;
  }

  getAllChatMessages(data): Observable<any> {
    this.socket.emit('clientQueriedChatMessages', data);

    const chatMessageObs = Observable.create((observable) => {
      this.authService.getTokenFromStorage()
        .then(token => {
          const decodedToken = this.authService.getDecodedAccessToken(token);
          const chatMessageEvent = decodedToken.id + '-clientGetChatMessages';

          this.socket.on(chatMessageEvent, (data) => {
            observable.next(data);
          });  
        });
    });

    return chatMessageObs;
  }
}