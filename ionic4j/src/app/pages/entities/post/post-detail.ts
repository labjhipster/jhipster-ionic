import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Post } from './post.model';
import { PostService } from './post.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-post-detail',
    templateUrl: 'post-detail.html'
})
export class PostDetailPage implements OnInit {
    post: Post = {};

    constructor(
        private dataUtils: JhiDataUtils,
        private navController: NavController,
        private postService: PostService,
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((response) => {
            this.post = response.data;
        });
    }

    open(item: Post) {
        this.navController.navigateForward('/tabs/entities/post/' + item.id + '/edit');
    }

    async deleteModal(item: Post) {
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
                        this.postService.delete(item.id).subscribe(() => {
                            this.navController.navigateForward('/tabs/entities/post');
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

}
