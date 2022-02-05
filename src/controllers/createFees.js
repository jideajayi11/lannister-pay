import models from "../models";

class CreateFeesDocument {
  constructor(input) {
    this.dataRows = input.split("\n");
  }

  getDataIntoColumns () {
    return this.dataRows.map(row => {
      const specs = row.split(/\s+\:\s+/);
      const specs1 = specs[0].split(/\s+/);
      const specs2 = specs[1].split(/\s+/);

      return {
        id: specs1[0],
        currency: specs1[1],
        locale: specs1[2],
        feeEntity: specs1[3].replace(/\(.+\)/, ""),
        entityProperty: specs1[3].replace(/^.+\((.+)\)$/, "$1"),
        feeType: specs2[1],
        feeValue: specs2[2],
      };
    });
  }
};

export default async (req, res) => {
  const createDocInstance = new CreateFeesDocument(req.body.FeeConfigurationSpec);
  const feesArray = createDocInstance.getDataIntoColumns();

  try {
    const feesRes = await models.Configspec.insertMany(feesArray);
    if(feesRes.length) {
      return res.status(200).send({ status: "ok" });
    } else {
      throw new Error("No data was inserted");
    }
  } catch(err){
    return res.status(400).send({ message: err.message });
  }
};
