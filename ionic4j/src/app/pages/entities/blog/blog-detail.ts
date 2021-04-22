import { Component, OnInit } from '@angular/core';
import { Blog } from './blog.model';
import { BlogService } from './blog.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-blog-detail',
    templateUrl: 'blog-detail.html'
})
export class BlogDetailPage implements OnInit {
    blog: Blog = {};

    constructor(
        private navController: NavController,
        private blogService: BlogService,
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((response) => {
            this.blog = response.data;
        });
    }

    open(item: Blog) {
        this.navController.navigateForward('/tabs/entities/blog/' + item.id + '/edit');
    }

    async deleteModal(item: Blog) {
        const alert = await this.alertController.create({
            header: 'Confirm the deletion?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Delete',
                    handler: () => {
                        this.blogService.delete(item.id).subscribe(() => {
                            this.navController.navigateForward('/tabs/entities/blog');
                        });
                    }
                }
            ]
        });
        await alert.present();
    }


}
