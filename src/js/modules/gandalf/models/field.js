
angular.module('ng-gandalf').factory('DecisionField', function (gandalfUtils) {

  function DecisionField (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.id = options._id || gandalfUtils.objectId();
    this.key = options.key;
    this.type = options.type;
    this.title = options.title;

    this.source = options.source;

    this.preset = options.preset;

    this.defaultValue = options.defaultValue;
  }

  DecisionField.prototype.toJSON = function () {
    return {
      _id: this.id,
      key: this.key,
      type: this.type,
      title: this.title,
      source: this.source,
      preset: this.preset,
      isDeleted: this.isDeleted || undefined
    };
  };

  return DecisionField;
});
