import { BaseEntity } from 'src/model/base-entity';
import { Blog } from '../blog/blog.model';
import { Tag } from '../tag/tag.model';

export class Post implements BaseEntity {
    constructor(
        public id?: number,
        public title?: string,
        public content?: any,
        public date?: any,
        public blog?: Blog,
        public tags?: Tag[],
    ) {
    }
}
