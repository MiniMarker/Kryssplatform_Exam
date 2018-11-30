import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Injectable()
export class BookInfoProvider {

  constructor(private http: HttpClient) {}

  /**
   * Get the JSON-endpoint form Google Books API for the given ISBN-book
   * No need for API-Key for this query
   * @param {string} isbn ISBN-code of the book
   * @returns {Observable<Object>} Observable JSON-Object containing the data
   */
  public getBookDataFromIsbn(isbn: string): Observable<Object> {

    //concatenating the url
    let url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    return this.http.get(url)
  }
}
