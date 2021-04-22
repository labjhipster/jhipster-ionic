import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';

export class Blog implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public handle?: string,
        public user?: User,
    ) {
    }
}
