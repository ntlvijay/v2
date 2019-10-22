import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MainService } from './main.service';



@Injectable()
export class BlogService {

  serverAddress: String;
  token: any;
options;
  constructor(
    private http: Http,
    private flashMessagesService: FlashMessagesService,
    private mainService: MainService,
  ) {
      this.serverAddress = this.mainService.getServerAddress();
   }

   getBlogCount(blogInfo) {
     let headers = new Headers;
     headers.append('Content-Type', 'application/json');
     return this.http.post('http://' + this.serverAddress + '/blogs/countBlogs', blogInfo, {headers: headers}).pipe(
       map(res => res.json()));
   }

  getBlogs(blogInfo) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/blogs', blogInfo, {headers: headers}).pipe(
      map(res => res.json()));
  }

  // Function to get all blogs from the database
  getAllBlogs() {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/blogs/allBlogs', {headers: headers}).pipe(
      map(res => res.json()));
  }

  searchBlogs(blogObj) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/blogs/searchBlogs', blogObj, {headers: headers}).pipe(
      map(res => res.json()));
  }

  getBlogById(blog) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/blogs/getBlogById', blog, {headers: headers}).pipe(
      map(res => res.json()));
  }

  getBlogByUsername(user) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://' + this.serverAddress + '/blogs/getBlogByUsername', user, {headers: headers}).pipe(
      map(res => res.json()));
  }

  addBlog(blog) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/blogs/addBlog', blog, {headers: headers}).pipe(
      map(res => res.json()));
  }

  editBlog(blog) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/blogs/editBlog', blog, {headers: headers}).pipe(
      map(res => res.json()));
  }

  deleteBlog(blog) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    return this.http.post('http://' + this.serverAddress + '/blogs/deleteBlog', blog, { headers: headers }).pipe(
    map(res => res.json()));
  }

  likeBlog(id) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    const blogData = { id: id };
    return this.http.put('http://' + this.serverAddress +  'blogs/likeBlog/', blogData, { headers: headers }).pipe(
      map(res => res.json()));
    }
  
  // Function to dislike a blog post
  dislikeBlog(id) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    this.token = localStorage.getItem('id_token');
    headers.append('Authorization', this.token);
    const blogData = { id: id };
    return this.http.put('http://' + this.serverAddress +  'blogs/dislikeBlog/', blogData, { headers: headers }).pipe(
      map(res => res.json()));
    }
  

  handleError(error: any) {
    this.flashMessagesService.show(error.statusText || "Server Error. Contact admin if error persists", { cssClass: 'alert-danger', timeout: 2500 });
  }
}
