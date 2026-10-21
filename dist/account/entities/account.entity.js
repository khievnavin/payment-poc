"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = exports.AccountStatus = void 0;
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["FROZEN"] = "FROZEN";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
class Account {
    id;
    name;
    currency;
    balance;
    status;
    createdAt;
    updatedAt;
}
exports.Account = Account;
//# sourceMappingURL=account.entity.js.map