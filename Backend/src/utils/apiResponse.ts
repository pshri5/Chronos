class apiResponse<t=any> {
    public statusCode: number;
    public data: t;
    public message: string;
    public success: boolean
    

  constructor(statusCode:number, data:t, message:string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { apiResponse };
