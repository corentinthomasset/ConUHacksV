// User Model

import { Model } from '@vuex-orm/core'
import Box from "./Box";

export default class User extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'users';
    static primaryKey = 'email';

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields () {
        return {
            email: this.string(''),
            firstName: this.string(''),
            lastName: this.string(''),
            company: this.string(''),
            deliveryService: this.boolean(false),
            boxes: this.hasMany(Box, 'ownerEmail')
        }
    }
}
