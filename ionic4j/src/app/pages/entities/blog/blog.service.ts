import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Blog } from './blog.model';

@Injectable({ providedIn: 'root'})
export class BlogService {
    private resourceUrl = ApiService.API_URL + '/blogs';

    constructor(protected http: HttpClient) { }

    create(blog: Blog): Observable<HttpResponse<Blog>> {
        return this.http.post<Blog>(this.resourceUrl, blog, { observe: 'response'});
    }

    update(blog: Blog): Observable<HttpResponse<Blog>> {
        return this.http.put(this.resourceUrl, blog, { observe: 'response'});
    }

    find(id: number): Observable<HttpResponse<Blog>> {
        return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    query(req?: any): Observable<HttpResponse<Blog[]>> {
        const options = createRequestOption(req);
        return this.http.get<Blog[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }
}
