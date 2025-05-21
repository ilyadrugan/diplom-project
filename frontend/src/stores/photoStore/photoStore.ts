import { makeAutoObservable } from "mobx";
import { getPhotosApi } from "./photoStore.api";
import { PhotoModel } from "./models";

export class PhotoStore {
  isLoading = false;
  photosList: PhotoModel[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async getPhotos(date: string) {
    this.isLoading = true;

    await getPhotosApi(date)
      .then(async (result)=>{        
        if (result.data) {
          this.photosList = result.data;
       }
      })
      .catch((err)=>{
        console.log('login ERROR',err.response.data);
        this.isLoading = false;
      })
      .finally(()=>{this.isLoading = false;});
    }

}

const photoStore = new PhotoStore();
export default photoStore;