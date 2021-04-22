import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Blog } from './blog.model';
import { BlogService } from './blog.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'page-blog-update',
    templateUrl: 'blog-update.html'
})
export class BlogUpdatePage implements OnInit {

    blog: Blog;
    users: User[];
    isSaving = false;
    isNew = true;
    isReadyToSave: boolean;

    form = this.formBuilder.group({
        id: [],
        name: [null, [Validators.required]],
        handle: [null, [Validators.required]],
        user: [null, []],
    });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected navController: NavController,
        protected formBuilder: FormBuilder,
        public platform: Platform,
        protected toastCtrl: ToastController,
        private userService: UserService,
        private blogService: BlogService
    ) {

        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });

    }

    ngOnInit() {
        this.userService.findAll().subscribe(data => this.users = data, (error) => this.onError(error));
        this.activatedRoute.data.subscribe((response) => {
            this.blog = response.data;
            this.isNew = this.blog.id === null || this.blog.id === undefined;
            this.updateForm(this.blog);
        });
    }

    updateForm(blog: Blog) {
        this.form.patchValue({
            id: blog.id,
            name: blog.name,
            handle: blog.handle,
            user: blog.user,
        });
    }

    save() {
        this.isSaving = true;
        const blog = this.createFromForm();
        if (!this.isNew) {
            this.subscribeToSaveResponse(this.blogService.update(blog));
        } else {
            this.subscribeToSaveResponse(this.blogService.create(blog));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<Blog>>) {
        result.subscribe((res: HttpResponse<Blog>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onError(res.error));
    }

    async onSaveSuccess(response) {
        let action = 'updated';
        if (response.status === 201) {
          action = 'created';
        }
        this.isSaving = false;
        const toast = await this.toastCtrl.create({message: `Blog ${action} successfully.`, duration: 2000, position: 'middle'});
        toast.present();
        this.navController.navigateBack('/tabs/entities/blog');
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

    private createFromForm(): Blog {
        return {
            ...new Blog(),
            id: this.form.get(['id']).value,
            name: this.form.get(['name']).value,
            handle: this.form.get(['handle']).value,
            user: this.form.get(['user']).value,
        };
    }

    compareUser(first: User, second: User): boolean {
        return first && first.id && second && second.id ? first.id === second.id : first === second;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}
