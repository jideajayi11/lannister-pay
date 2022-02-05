import models from "../models";

class ComputeFeeController {
  constructor(payload) {
    this.dbFilter = {
      currency: this.getRegexPattern(payload.Currency),
      locale: this.getRegexPattern(this.getLocale(payload.CurrencyCountry, payload.PaymentEntity.Country)),
      feeEntity: this.getRegexPattern(payload.PaymentEntity.Type),
      entityProperty: this.getRegexPattern([
        payload.PaymentEntity.ID,
        payload.PaymentEntity.Issuer,
        payload.PaymentEntity.Brand,
        payload.PaymentEntity.Number,
        payload.PaymentEntity.SixID,
      ]),
    };
    this.bearsFee = payload.Customer.BearsFee;
    this.amount = parseFloat(payload.Amount);
  }

  getRegexPattern(value) {
    if(typeof value === "string") {
      return new RegExp(value ? `(${value.replace(/[\*]/g, "[\*]")})|[\*]` : "[\*]");
    }
    return this.getRegexPattern(value.filter(item => !!item).join(")|("));
  }

  getLocale(currencyCountry, paymentCountry) {
    return currencyCountry && paymentCountry && currencyCountry === paymentCountry ?
      "LOCL" :
      "INTL"
  }

  calcAllFees(feeObj) {
    const feeTypeObj = {
      FLAT: value => parseFloat(value),
      PERC: value => this.amount * parseFloat(value) / 100,
      FLAT_PERC: value => {
        const values = value.split(":");
        return parseFloat(values[0]) + (this.amount * parseFloat(values[1]) / 100);
      },
    };
    const AppliedFeeValue = feeTypeObj[feeObj.feeType](feeObj.feeValue);
    const ChargeAmount = this.bearsFee ? this.amount + AppliedFeeValue : this.amount;

    return {
      AppliedFeeID: feeObj.id,
      AppliedFeeValue,
      ChargeAmount,
      SettlementAmount: ChargeAmount - AppliedFeeValue,
    };
  }

  selectTransactionFee(feesArray) {
    let maxCount = 0;
    let filteredFees = [];
    feesArray.forEach(item => {
      let count = 0;
      count += item.currency !== "*" ? 1 : 0;
      count += item.locale !== "*" ? 1 : 0;
      count += item.feeEntity !== "*" ? 1 : 0;
      count += item.entityProperty !== "*" ? 1 : 0;

      if(count === maxCount) {
        filteredFees.push(item);
      } else if(count > maxCount) {
        maxCount = count;
        filteredFees = [item];
      }
    });

    if(filteredFees.length === 1) {
      return filteredFees[0];
    }

    // use the priority list when the configuration specs with highest specificity
    // that was returned are more that one. 
    const fieldsPriorityList = ["entityProperty", "feeEntity", "locale", "currency"];
    return fieldsPriorityList.reduce((acc, currentValue) => {
      const newFilter = acc.filter(item => item[currentValue] !== "*");
      return newFilter.length ? newFilter : acc;
    }, filteredFees)[0];
  }
};

export default async (req, res) => {
  try {
    const computeFeeInstance = new ComputeFeeController(req.body);
    const computeFeeRes = await models.Configspec.find(computeFeeInstance.dbFilter);

    if(computeFeeRes.length < 1) {
      return res.status(404).send({message: "No fee configuration found"});
    } else if (computeFeeRes.length === 1) {
      return res.status(200).send(computeFeeInstance.calcAllFees(computeFeeRes[0]));
    }

    return res.status(200).send(
      computeFeeInstance.calcAllFees(computeFeeInstance.selectTransactionFee(computeFeeRes))
    );
  } catch(err){
    return res.status(400).send({ message: err.message });
  }
};
