import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Blog } from './blog.model';
import { BlogService } from './blog.service';

@Component({
    selector: 'page-blog',
    templateUrl: 'blog.html'
})
export class BlogPage {
    blogs: Blog[];

    // todo: add pagination

    constructor(
        private navController: NavController,
        private blogService: BlogService,
        private toastCtrl: ToastController,
        public plt: Platform
    ) {
        this.blogs = [];
    }

    ionViewWillEnter() {
        this.loadAll();
    }

    async loadAll(refresher?) {
        this.blogService.query().pipe(
            filter((res: HttpResponse<Blog[]>) => res.ok),
            map((res: HttpResponse<Blog[]>) => res.body)
        )
        .subscribe(
            (response: Blog[]) => {
                this.blogs = response;
                if (typeof(refresher) !== 'undefined') {
                    setTimeout(() => {
                        refresher.target.complete();
                    }, 750);
                }
            },
            async (error) => {
                console.error(error);
                const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
                toast.present();
            });
    }

    trackId(index: number, item: Blog) {
        return item.id;
    }

    new() {
        this.navController.navigateForward('/tabs/entities/blog/new');
    }

    edit(item: IonItemSliding, blog: Blog) {
        this.navController.navigateForward('/tabs/entities/blog/' + blog.id + '/edit');
        item.close();
    }

    async delete(blog) {
        this.blogService.delete(blog.id).subscribe(async () => {
            const toast = await this.toastCtrl.create(
                {message: 'Blog deleted successfully.', duration: 3000, position: 'middle'});
            toast.present();
            this.loadAll();
        }, (error) => console.error(error));
    }

    view(blog: Blog) {
        this.navController.navigateForward('/tabs/entities/blog/' + blog.id + '/view');
    }
}
