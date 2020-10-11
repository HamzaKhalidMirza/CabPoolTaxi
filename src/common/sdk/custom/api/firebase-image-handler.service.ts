import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { AuthService } from './../../core/auth.service';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirebaseImageHandler {
  task: AngularFireUploadTask;

  constructor(
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {}

  public async uploadProfileImg(credentials, folder) {

    if(credentials.photoAvatar instanceof File || credentials.photoAvatar instanceof Blob) {
      const token = await this.authService.getTokenFromStorage();
      const decodedToken = this.authService.getDecodedAccessToken(token);
  
      const uploadObs = this.uploadFileAndGetMetadata(
        credentials.photoAvatar,
        decodedToken.user.id,
        folder
      );
  
      return uploadObs.downloadUrl$;  
    } else {
      const obs = Observable.create(obs => {
        obs.next(credentials.photoAvatar);
      });
      return obs;
    }
  }

  uploadFileAndGetMetadata(fileToUpload: File, userId, folder) {
    const filePath = `public/img/${folder}/${folder}-${Date.now()}-${userId}`;
    const ref = this.storage.ref(filePath);
    this.task = this.storage.upload(filePath, fileToUpload);

    return {
      uploadProgress$: this.task.percentageChanges(),
      downloadUrl$: this.getDownloadUrl$(this.task, filePath),
    };
  }

  private getDownloadUrl$(
    uploadTask: AngularFireUploadTask,
    path: string
  ): Observable<string> {
    return from(uploadTask).pipe(
      switchMap((_) => this.storage.ref(path).getDownloadURL())
    );
  }

  deleteImage(downloadUrl) {
    return this.storage.storage.refFromURL(downloadUrl).delete();
  }
}
