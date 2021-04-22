import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Blog, BlogService } from '../blog';
import { Tag, TagService } from '../tag';

@Component({
    selector: 'page-post-update',
    templateUrl: 'post-update.html'
})
export class PostUpdatePage implements OnInit {

    post: Post;
    blogs: Blog[];
    tags: Tag[];
    date: string;
    isSaving = false;
    isNew = true;
    isReadyToSave: boolean;

    form = this.formBuilder.group({
        id: [],
        title: [null, [Validators.required]],
        content: [null, [Validators.required]],
        date: [null, [Validators.required]],
        blog: [null, []],
          tags: [null, []],
    });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected navController: NavController,
        protected formBuilder: FormBuilder,
        public platform: Platform,
        protected toastCtrl: ToastController,
        private dataUtils: JhiDataUtils,
        private blogService: BlogService,
        private tagService: TagService,
        private postService: PostService
    ) {

        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });

    }

    ngOnInit() {
        this.blogService.query()
            .subscribe(data => { this.blogs = data.body; }, (error) => this.onError(error));
        this.tagService.query()
            .subscribe(data => { this.tags = data.body; }, (error) => this.onError(error));
        this.activatedRoute.data.subscribe((response) => {
            this.post = response.data;
            this.isNew = this.post.id === null || this.post.id === undefined;
            this.updateForm(this.post);
        });
    }

    updateForm(post: Post) {
        this.form.patchValue({
            id: post.id,
            title: post.title,
            content: post.content,
            date: this.isNew ? new Date().toISOString() : post.date,
            blog: post.blog,
            tags: post.tags,
        });
    }

    save() {
        this.isSaving = true;
        const post = this.createFromForm();
        if (!this.isNew) {
            this.subscribeToSaveResponse(this.postService.update(post));
        } else {
            this.subscribeToSaveResponse(this.postService.create(post));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<Post>>) {
        result.subscribe((res: HttpResponse<Post>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onError(res.error));
    }

    async onSaveSuccess(response) {
        let action = 'updated';
        if (response.status === 201) {
          action = 'created';
        }
        this.isSaving = false;
        const toast = await this.toastCtrl.create({message: `Post ${action} successfully.`, duration: 2000, position: 'middle'});
        toast.present();
        this.navController.navigateBack('/tabs/entities/post');
    }

    previousState() {
        window.history.back();
    }

    async onError(error) {
        this.isSaving = false;
        console.error(error);
        const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
        toast.present();
    }

    private createFromForm(): Post {
        return {
            ...new Post(),
            id: this.form.get(['id']).value,
            title: this.form.get(['title']).value,
            content: this.form.get(['content']).value,
            date: new Date(this.form.get(['date']).value),
            blog: this.form.get(['blog']).value,
            tags: this.form.get(['tags']).value,
        };
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, field, isImage) {
        this.dataUtils.loadFileToForm(event, this.form, field, isImage).subscribe();
    }

    compareBlog(first: Blog, second: Blog): boolean {
        return first && first.id && second && second.id ? first.id === second.id : first === second;
    }

    trackBlogById(index: number, item: Blog) {
        return item.id;
    }
    compareTag(first: Tag, second: Tag): boolean {
        return first && first.id && second && second.id ? first.id === second.id : first === second;
    }

    trackTagById(index: number, item: Tag) {
        return item.id;
    }
}
