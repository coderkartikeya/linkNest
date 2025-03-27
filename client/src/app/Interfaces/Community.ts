interface Community {
    _id: number;
    name: string;
    description: string;
    username:string;
    owner: string;
    category: string;
    profileImage?: string;
    location:{
        ipAdress:{
            lat:number,
            lng:number
        },
        city:string,
        state: string,
        country: string
    }
    
  }

  export type {Community};