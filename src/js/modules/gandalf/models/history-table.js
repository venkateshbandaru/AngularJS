angular.module('ng-gandalf').factory('DecisionHistoryTable', function ($gandalf, DecisionTable, DecisionVariant, DecisionHistoryRule) {

  function DecisionHistoryTable () {
    this.finalDecision = null;
    this.request = null;
    this.createdAt = null;
    this.updatedAt = null;
    this.variant = null;

    DecisionTable.apply(this, arguments);
  }
  DecisionHistoryTable.prototype = Object.create(DecisionTable.prototype, {
    _modelRule: {
      value: DecisionHistoryRule
    }
  });
  DecisionHistoryTable.prototype.constructor = DecisionHistoryTable;

  DecisionHistoryTable.prototype.parse = function (data) {

    var self = this;

    DecisionTable.prototype.parse.call(this, data);

    this.table = new DecisionTable(data.table.id, data.table);
    this.variant = new DecisionVariant(data.table.variant);

    this.rules = data.rules.map(function (item) {
      return new self._modelRule(item);
    });

    this.finalDecision = data.final_decision;
    this.request = data.request;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
    this.defaultDecision = data.default_decision;

    return this;
  };

  DecisionHistoryTable.prototype.fetch = function () {
    return $gandalf.admin.getDecisionById(this.id).then(function (resp) {
      return this.parse(resp.data);
    }.bind(this));
  };

  DecisionHistoryTable.prototype.toJSON = function () {
    var res = DecisionTable.prototype.toJSON.call(this);
    res.final_decision = this.finalDecision;
    res.request = this.request;
    res.created_at = this.createdAt;
    res.updated_at = this.updatedAt;
    res.default_decision = this.defaultDecision;

    return res;
  };

  DecisionHistoryTable.find = function (tableId, size, page) {
    return $gandalf.admin.getDecisions(tableId, size, page).then(function (resp) {
      resp.data = resp.data.map(function (item) {
        return new DecisionHistoryTable(item._id, item);
      });
      return resp;
    });
  };

  return DecisionHistoryTable;

});
