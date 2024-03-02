export const getMongodbOperatorFromMuiOperator = (muiOperator: string) => {
  if (muiOperator === "<") return "$lte";
  if (muiOperator === ">") return "$gte";
  if (muiOperator === "=") return "$eq";

  return null;
};
