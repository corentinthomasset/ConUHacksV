// User Box

import { Model } from '@vuex-orm/core'
import User from "./User";

export default class Box extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'box';
    static primaryKey = 'id';

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields () {
        return {
            id: this.string(''),
            name: this.string('Home'),
            ownerEmail: this.string(''),
            address: this.string(''),
            lastChecked: this.number(1579960032000),
            open: this.boolean(false),
            flag: this.boolean(false),
            alarm: this.boolean(false),
            owner: this.belongsTo(User, 'owner_email')
        }
    }
}
