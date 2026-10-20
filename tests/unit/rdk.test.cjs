const { test } = require("node:test");
const assert = require("node:assert/strict");
const { calculateEmi } = require("../../tmp/unit/emi.js");
const { validateEnquiry } = require("../../tmp/unit/enquiry.js");
const { whatsappUrl } = require("../../tmp/unit/rdk.js");

const valid = {
  loanType: "home",
  fullName: "Example Applicant",
  dob: "1995-03-15",
  gender: "prefer_not_to_say",
  mobile: "9876543210",
  email: "applicant@example.invalid",
  pan: "ABCDE1234F",
  aadhaar: "234567890123",
  address: "Test address",
  employmentType: "cash_salary",
  organisation: "Example Company",
  monthlyIncome: "30000",
  existingLoans: "None",
  existingEmis: "0",
  loanAmount: "1000000",
  tenure: "300",
  remarks: "",
  consent: true,
};
test("reducing balance gives the standard amortised payment", () => {
  const result = calculateEmi(1000000, 10, 120, "reducing");
  assert.ok(Math.abs(result.monthly - 13215.0737) < 0.001);
  assert.ok(Math.abs(result.total - result.interest - 1000000) < 0.001);
});
test("flat interest and zero interest use the chosen method", () => {
  assert.equal(calculateEmi(120000, 10, 12, "flat").monthly, 11000);
  assert.equal(calculateEmi(120000, 0, 12, "reducing").monthly, 10000);
  assert.equal(calculateEmi(120000, 0, 12, "flat").interest, 0);
});
test("calculator rejects invalid inputs and more than 25 years", () => {
  for (const args of [
    [0, 10, 12],
    [-1, 10, 12],
    [10, -1, 12],
    [10, 10, 0],
    [10, 10, 301],
    [10, 10, 12.5],
    [Infinity, 10, 12],
  ]) {
    assert.equal(calculateEmi(...args, "reducing"), null);
  }
  assert.notEqual(calculateEmi(1000000, 10, 300, "reducing"), null);
});
test("all client-selected products support valid enquiries", () => {
  for (const loanType of ["home", "property", "od_cc", "personal"]) {
    assert.deepEqual(
      validateEnquiry({ ...valid, loanType, employmentType: "bank_salary" })
        .errors,
      {},
    );
  }
});
test("old products, invalid identities, impossible dates and consent are rejected", () => {
  for (const [key, value] of Object.entries({
    loanType: "gold",
    mobile: "1234",
    email: "invalid",
    pan: "bad",
    aadhaar: "123456789012",
    dob: "2020-02-31",
    tenure: "360",
    consent: false,
    loanAmount: "-1",
    gender: "unknown",
    monthlyIncome: "Infinity",
    existingEmis: "-50",
  })) {
    assert.ok(validateEnquiry({ ...valid, [key]: value }).errors[key], key);
  }
  assert.ok(validateEnquiry(null).errors.fullName);
  assert.ok(validateEnquiry({ ...valid, dob: "2999-01-01" }).errors.dob);
});
test("personal loan salary threshold is strictly above 20000 and bank credited", () => {
  assert.equal(
    validateEnquiry({
      ...valid,
      loanType: "personal",
      employmentType: "bank_salary",
      monthlyIncome: "20000",
    }).errors.monthlyIncome,
    "personal",
  );
  assert.equal(
    validateEnquiry({
      ...valid,
      loanType: "personal",
      employmentType: "cash_salary",
    }).errors.monthlyIncome,
    "personal",
  );
  assert.deepEqual(
    validateEnquiry({
      ...valid,
      loanType: "personal",
      employmentType: "bank_salary",
      monthlyIncome: "20001",
    }).errors,
    {},
  );
});
test("PAN and Aadhaar normalization preserves valid values", () => {
  const result = validateEnquiry({
    ...valid,
    pan: " abcde1234f ",
    aadhaar: "2345 6789 0123",
  });
  assert.deepEqual(result.errors, {});
  assert.equal(result.data.pan, "ABCDE1234F");
  assert.equal(result.data.aadhaar, "234567890123");
});
test("WhatsApp link targets supplied business phone and safely encodes text", () => {
  const message = "Hello & welcome\n₹10,000 தமிழ்";
  const url = new URL(whatsappUrl(message));
  assert.equal(url.pathname, "/917373346937");
  assert.equal(url.searchParams.get("text"), message);
});
