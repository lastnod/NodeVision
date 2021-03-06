var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var branch_1 = require('./branch');
var NVNode = (function () {
    function NVNode(branch, id, name, node_attributs, users) {
        this._id = id;
        this._name = name;
        this._node_attributs = node_attributs;
        this._branch = branch;
        this._users = users;
    }
    Object.defineProperty(NVNode.prototype, "name", {
        //get & set
        get: function () { return this._name; },
        set: function (name) { this._name = name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NVNode.prototype, "id", {
        get: function () { return this._id; },
        set: function (id) { this._id = id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NVNode.prototype, "attributes", {
        get: function () { return this._node_attributs; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NVNode.prototype, "branch", {
        get: function () { return this._branch; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NVNode.prototype, "users", {
        get: function () { return this._users; },
        enumerable: true,
        configurable: true
    });
    NVNode = __decorate([
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [branch_1.Branch, Number, String, Array, Array])
    ], NVNode);
    return NVNode;
})();
exports.NVNode = NVNode;
//# sourceMappingURL=node.js.map