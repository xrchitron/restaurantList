function orderCase(order) {
  switch (order) {
    case "1":
      return ["name_en"];
    case "2":
      return ["name_en", "DESC"];
    case "3":
      return ["category"];
    case "4":
      return ["location"];
    default:
      return [];
  }
}
module.exports = { orderCase };
