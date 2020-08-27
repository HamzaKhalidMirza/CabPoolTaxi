import { ChatSocket } from "./../../../../common/sdk/custom/sockets/chatSocket.service";
import { ChatMessage } from "./../../../../common/model/chatMessage.model";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "src/common/sdk/core/auth.service";
import { Location } from "@angular/common";
import { IonContent } from "@ionic/angular";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { format } from "date-fns";

@Component({
  selector: "app-chat-room",
  templateUrl: "./chat-room.page.html",
  styleUrls: ["./chat-room.page.scss"],
})
export class ChatRoomPage implements OnInit {
  @ViewChild("ionContent", { static: true }) ionContent: IonContent;
  chatForm: FormGroup;
  clientData: any;
  driverData: any;
  chatMessagesList: any = [];

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private chatSocketService: ChatSocket
  ) {}

  ngOnInit() {
    this.formInitializer();
    this.ionContent.scrollToBottom(300);
  }

  async ionViewWillEnter() {
    this.clientData = await this.authService.getCurrentUser();
    this.driverData = await this.authService.getFieldDataFromStorage(
      "chat-driverData"
    );

    this.chatSocketService
      .getAllChatMessages({
        driver: this.driverData.id,
        client: this.clientData.id,
      })
      .subscribe(
        (chatMessages) => {
          console.log(chatMessages);
          this.chatMessagesList = chatMessages;
          this.ionContent.scrollToBottom(300);
        },
        (err) => {
          console.log(err);
        }
      );

      const receiveObs = this.chatSocketService
      .receivedMessage()
      .subscribe(
        (chatMessage) => {
          this.chatMessagesList.push(chatMessage);
          this.ionContent.scrollToBottom(300);
          receiveObs.unsubscribe();
        },
        (err) => {
          console.log(err);
        }
      );  
  }

  formInitializer() {
    this.chatForm = this.formBuilder.group({
      message: ["", Validators.required],
    });
    this.chatForm.reset();
  }

  sendMessage() {
    if (this.chatForm.invalid) {
      return;
    }
    let chatData: ChatMessage = {
      senderName: this.clientData.username,
      senderId: this.clientData.id,
      senderRole: this.clientData.role,
      receiverName: this.driverData.username,
      receiverId: this.driverData.id,
      message: this.chatForm.value.message,
      driver: this.driverData.id,
      client: this.clientData.id,
      createdAt: new Date()
    };

    const sendObs = this.chatSocketService.sendMessage(chatData).subscribe(
      (chatMessage) => {
        this.chatMessagesList.push(chatMessage);
        this.ionContent.scrollToBottom(300);
        sendObs.unsubscribe();
      },
      (err) => {
        console.log(err);
      }
    );
    this.chatForm.reset();
  }

  setDateAndTime(dateStr) {
    let dateAndTime = "";
    dateAndTime += this.getTime(dateStr) + " | ";
    dateAndTime += this.getDate(dateStr);
    return dateAndTime;
  }

  getDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: "long" });
  }

  getTime(dateStr) {
    var time = new Date(dateStr);
    return format(time, "hh:mm a");
  }

  getDate(dateStr) {
    var messageDate = new Date(dateStr);
    var currentDate = new Date();

    var message = "";

    if (
      format(messageDate, "dd-MM-yyyy") === format(currentDate, "dd-MM-yyyy")
    ) {
      message = "Today";
    } else if (
      format(messageDate.getDate(), "dd-MM-yyyy") ===
      format(currentDate.getDate() - 1, "dd-MM-yyyy")
    ) {
      message = "Yesterday";
    } else {
      message = format(messageDate, "LLLL dd");
    }
    return message;
  }

  goBack() {
    this.location.back();
  }
}
