import { makeAutoObservable } from "mobx";
import { changeUserApi, createUserApi, getUserByIdApi, getUsersApi, login } from "./UserStore.api";
import { ChangeUserModel, CreateUserModel, LoginByEmailPasswordModel, UserInfoModel } from "./models";

export class UserStore {
  isLoading = false;
  user: UserInfoModel = null;
  token: string = null;
  errorMessage: string = '';
  users: UserInfoModel[] = [];
  isCreatingUserLoading = false;
  currentUser: UserInfoModel = null;
  isChangeUserLoading = false;
  constructor() {
    makeAutoObservable(this);
    const user = JSON.parse(localStorage.getItem("_currentUser"));
    if (user) {
      this.getUsers()
      this.user = user
    }
    
  }

  setUser(userData: UserInfoModel) {
    this.user = userData;
  }

  setToken(token: string) {
    this.token = token;
  }
  async getUsers() {
    this.isLoading = true;
    this.errorMessage = '';

    await getUsersApi()
      .then(async (result)=>{
        console.log('THEN', result.data.data);
        
        if (result.data.data) {
          if (this.user.login!== 11111) {
            this.users = result.data.data.filter((user:UserInfoModel)=>user.user_status==='W')
          }
          else {
            this.users = result.data.data
          }
          
        }
      
      })
      .catch((err)=>{
        console.log('getUsersApi ERROR',err.response.data);
        this.errorMessage = err.response.data.detail
        this.isLoading = false;
      })
      .finally(()=>{this.isLoading = false;});
  }
  async getUserById(id:number) {
    this.isLoading = true;
    this.errorMessage = '';

    await getUserByIdApi(id)
      .then(async (result)=>{
        console.log('THEN', result.data.data);
        
        if (result.data.data) {
          this.currentUser = result.data.data
        }
      
      })
      .catch((err)=>{
        console.log('getUsersApi ERROR',err.response.data);
        this.errorMessage = err.response.data.detail
        this.isLoading = false;
      })
      .finally(()=>{this.isLoading = false;});
  }
  async login(model: LoginByEmailPasswordModel, callBack) {
    this.isLoading = true;
    this.errorMessage = '';

    await login(model)
      .then(async (result)=>{
        console.log('THEN', result.data.data);
        
        if (result.data.data) {
        this.setToken('TTTOKEN');
        userStore.setUser(result.data.data);
        await localStorage.setItem("token", 'TTTOKEN');
        await localStorage.setItem("_currentUser", JSON.stringify(result.data.data));
        // await sessionStorage.setItem("_currentUser", JSON.stringify(curUser));
        callBack()
      }
      })
      .catch((err)=>{
        console.log('login ERROR',err.response.data);
        this.errorMessage = err.response.data
        this.isLoading = false;
      })
      .finally(()=>{this.isLoading = false;});
    }
  async createUser(model: CreateUserModel) {
    this.isCreatingUserLoading = true;
    this.errorMessage = '';
    // console.log(model)
    await createUserApi(model)
      .then(async (result)=>{
        console.log('THEN', result.data.data);
        
      })
      .catch((err)=>{
        console.log('createUserApi ERROR',err.response.data);
        this.errorMessage = err.response.data.detail
        this.isCreatingUserLoading = false;
      })
      .finally(()=>{this.isCreatingUserLoading = false;});
    }
  
  async changeUser(model: ChangeUserModel, id: number) {
    this.isChangeUserLoading = true;
    this.errorMessage = '';
    // console.log(model)
    await changeUserApi(model, id)
      .then(async (result)=>{
        console.log('THEN', result.data.data);
        
      })
      .catch((err)=>{
        console.log('createUserApi ERROR',err.response.data);
        this.errorMessage = err.response.data.detail
        this.isChangeUserLoading = false;
      })
      .finally(()=>{this.isChangeUserLoading = false;});
    }
  logout() {
    this.user = null;
    this.token = null;
  }

  get isLoggedIn() {
    return !!this.token;
  }
}

const userStore = new UserStore();
export default userStore;