import * as helpers from "../helpers";

it("correctly converts dates", () => {
  expect(helpers.dateConverter("05Mar2019")).toBe("2019-03-05");
  expect(helpers.dateConverter("28Jan2027")).toBe("2027-01-28");
  expect(helpers.dateConverter("05Mar2019", "DD.MM.YYYY")).toBe("05.03.2019");
  expect(helpers.dateConverter("28Jan2027", "DD.MM.YYYY")).toBe("28.01.2027");
  expect(helpers.dateConverter("")).toBe("");
});
