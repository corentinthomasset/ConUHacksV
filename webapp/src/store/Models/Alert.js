import { Model } from '@vuex-orm/core'
import Box from "./Box";

export default class Alert extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'alert';

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields () {
        return {
            id: this.uid(),
            boxId: this.string(''),
            date: this.string(''),
            attachment: this.string(''),
            box: this.belongsTo(Box, 'boxId')
        }
    }
}
