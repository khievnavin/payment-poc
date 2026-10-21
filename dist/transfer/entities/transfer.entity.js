"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = exports.StepStatus = exports.TRANSFER_PIPELINE = exports.TransferStep = exports.TransferStatus = void 0;
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["PROCESSING"] = "PROCESSING";
    TransferStatus["COMPLETED"] = "COMPLETED";
    TransferStatus["FAILED"] = "FAILED";
    TransferStatus["REVERSED"] = "REVERSED";
})(TransferStatus || (exports.TransferStatus = TransferStatus = {}));
var TransferStep;
(function (TransferStep) {
    TransferStep["VALIDATE"] = "VALIDATE";
    TransferStep["CHECK_SENDER"] = "CHECK_SENDER";
    TransferStep["CHECK_RECEIVER"] = "CHECK_RECEIVER";
    TransferStep["CHECK_LIMIT"] = "CHECK_LIMIT";
    TransferStep["CHECK_FUNDS"] = "CHECK_FUNDS";
    TransferStep["DEBIT_SENDER"] = "DEBIT_SENDER";
    TransferStep["CREDIT_RECEIVER"] = "CREDIT_RECEIVER";
    TransferStep["REVERSE_DEBIT"] = "REVERSE_DEBIT";
})(TransferStep || (exports.TransferStep = TransferStep = {}));
exports.TRANSFER_PIPELINE = [
    TransferStep.VALIDATE,
    TransferStep.CHECK_SENDER,
    TransferStep.CHECK_RECEIVER,
    TransferStep.CHECK_LIMIT,
    TransferStep.CHECK_FUNDS,
    TransferStep.DEBIT_SENDER,
    TransferStep.CREDIT_RECEIVER,
];
var StepStatus;
(function (StepStatus) {
    StepStatus["OK"] = "OK";
    StepStatus["FAILED"] = "FAILED";
    StepStatus["SKIPPED"] = "SKIPPED";
})(StepStatus || (exports.StepStatus = StepStatus = {}));
class Transfer {
    id;
    fromAccountId;
    toAccountId;
    amount;
    currency;
    note;
    status;
    receiverCredited;
    failure;
    steps;
    createdAt;
    updatedAt;
}
exports.Transfer = Transfer;
//# sourceMappingURL=transfer.entity.js.map