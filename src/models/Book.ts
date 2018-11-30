export class Book {
  constructor(
    public isbn: number,
    public title: string,
    public author: string,
    public desc: string,
    public date: any,
    public price: number,
    public imgSrc: string,
    public location: any,
    public user: string,
    public userUid: string,
    public profilePictureUrl: string,
    public pageVisits: number,
    public condition: string,
    public category: string,
    public id?: string) {}
}
