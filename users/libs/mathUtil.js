
const _ = require('lodash');
export default {
  skipNullAttributes: (attributes) => {
    return _.omitBy(attributes, (attr) => {
      return _.isNil(attr.Value);
    });
  }
};