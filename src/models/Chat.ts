export class Chat {
  constructor(
    public senderUid: string,
    public senderName: string,
    public senderImg: string,
    public reciverUid: string,
    public reciverName: string,
    public reciverImg: string,
    public bookImgSrc: string,
    public bookTitle: string,
    public latestMessageTimeStamp: number,
    public latestMessageTime: string,
    public messages: any,
    public id?: string
  ){}
}
