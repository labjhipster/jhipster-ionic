import { BaseEntity } from 'src/model/base-entity';
import { Post } from '../post/post.model';

export class Tag implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public entries?: Post[],
    ) {
    }
}
