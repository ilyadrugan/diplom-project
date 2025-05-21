import { makeAutoObservable } from "mobx";
import { changeStatusRequestApi, getRequestByIdApi, getRequestsApi } from "./requestStore.api";
import { ChangeRequestStatusModel, RequestModel } from "./models";

export class RequestStore {
  isLoading = false;
  requestsList: RequestModel[] = [];
  requestsFilteredList: RequestModel[] = [];
  currentRequest: RequestModel = null;

  constructor() {
    makeAutoObservable(this);
  }
  filterByDate(date: Date) {
    this.requestsFilteredList = this.requestsList.filter((req)=>new Date(req.time_create).toLocaleDateString()===date.toLocaleDateString())
  }
  filterByLogin(login: number) {
    this.requestsList = this.requestsList.filter((req)=>req.user_login===login)
  }
  async getRequests() {
    this.isLoading = true;

    await getRequestsApi()
      .then(async (result)=>{        
        if (result.data.data) {
          this.requestsList = result.data.data;
          
          // await sessionStorage.setItem("_currentUser", JSON.stringify(curUser));
       }
      })
      .catch((err)=>{
        console.log('getRequestsApi ERROR',err.response.data);
        this.isLoading = false;
      })
      .finally(()=>{this.isLoading = false;});
    }
  async getRequest(id: number) {
    this.isLoading = true;

    await getRequestByIdApi(id)
      .then(async (result)=>{        
        if (result.data.data) {
          console.log(result.data.data)
          this.currentRequest = result.data.data;
          
          // await sessionStorage.setItem("_currentUser", JSON.stringify(curUser));
       }
      })
      .catch((err)=>{
        console.log('getRequestByIdApi ERROR',err.response.data);
        this.isLoading = false;
      })
      .finally(()=>{this.isLoading = false;});
    }
  async changeRequestStatus(model: ChangeRequestStatusModel) {
    this.isLoading = true;

    await changeStatusRequestApi(model)
      .then(async (result)=>{        
        if (result.data.data) {
          console.log(result.data.data)
          this.currentRequest = result.data.data;
          
          // await sessionStorage.setItem("_currentUser", JSON.stringify(curUser));
       }
      })
      .catch((err)=>{
        console.log('changeRequestStatus ERROR',err.response.data);
        this.isLoading = false;
      })
      .finally(()=>{this.isLoading = false;});
    }
}

const requestStore = new RequestStore();
export default requestStore;