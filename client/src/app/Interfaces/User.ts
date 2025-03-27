interface User {
    _id:string;
    fullName: string;
    username: string;
    profilePic: string;
    accessToken: string;
    refreshToken: string;
    communities:[{type:string}]

  }
  
  interface UserData {
    user: User;
  }
  
  interface AuthenticatedUser {
    data: UserData;
  }

  export type {AuthenticatedUser};