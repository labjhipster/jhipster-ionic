import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Tag } from './tag.model';
import { TagService } from './tag.service';
import { Post, PostService } from '../post';

@Component({
    selector: 'page-tag-update',
    templateUrl: 'tag-update.html'
})
export class TagUpdatePage implements OnInit {

    tag: Tag;
    posts: Post[];
    isSaving = false;
    isNew = true;
    isReadyToSave: boolean;

    form = this.formBuilder.group({
        id: [],
        name: [null, [Validators.required]],
    });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected navController: NavController,
        protected formBuilder: FormBuilder,
        public platform: Platform,
        protected toastCtrl: ToastController,
        private postService: PostService,
        private tagService: TagService
    ) {

        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });

    }

    ngOnInit() {
        this.postService.query()
            .subscribe(data => { this.posts = data.body; }, (error) => this.onError(error));
        this.activatedRoute.data.subscribe((response) => {
            this.tag = response.data;
            this.isNew = this.tag.id === null || this.tag.id === undefined;
            this.updateForm(this.tag);
        });
    }

    updateForm(tag: Tag) {
        this.form.patchValue({
            id: tag.id,
            name: tag.name,
        });
    }

    save() {
        this.isSaving = true;
        const tag = this.createFromForm();
        if (!this.isNew) {
            this.subscribeToSaveResponse(this.tagService.update(tag));
        } else {
            this.subscribeToSaveResponse(this.tagService.create(tag));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<Tag>>) {
        result.subscribe((res: HttpResponse<Tag>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onError(res.error));
    }

    async onSaveSuccess(response) {
        let action = 'updated';
        if (response.status === 201) {
          action = 'created';
        }
        this.isSaving = false;
        const toast = await this.toastCtrl.create({message: `Tag ${action} successfully.`, duration: 2000, position: 'middle'});
        toast.present();
        this.navController.navigateBack('/tabs/entities/tag');
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

    private createFromForm(): Tag {
        return {
            ...new Tag(),
            id: this.form.get(['id']).value,
            name: this.form.get(['name']).value,
        };
    }

    comparePost(first: Post, second: Post): boolean {
        return first && first.id && second && second.id ? first.id === second.id : first === second;
    }

    trackPostById(index: number, item: Post) {
        return item.id;
    }
}
