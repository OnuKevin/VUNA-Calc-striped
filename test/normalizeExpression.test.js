const { normalizeExpression } = require("../assets/js/script");

describe("normalizeExpression", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="result" />
      <button id="theme-toggle"></button>
    `;
  });

  test("replaces sin() with sinDeg()", () => {
    expect(normalizeExpression("sin(90)")).toBe("sinDeg(90)");
  });

  test("replaces cos() with cosDeg()", () => {
    expect(normalizeExpression("cos(0)")).toBe("cosDeg(0)");
  });

  test("replaces tan() with tanDeg()", () => {
    expect(normalizeExpression("tan(45)")).toBe("tanDeg(45)");
  });

  test("replaces asin() with asinDeg()", () => {
    expect(normalizeExpression("asin(1)")).toBe("asinDeg(1)");
  });

  test("replaces acos() with acosDeg()", () => {
    expect(normalizeExpression("acos(1)")).toBe("acosDeg(1)");
  });

  test("replaces atan() with atanDeg()", () => {
    expect(normalizeExpression("atan(1)")).toBe("atanDeg(1)");
  });

  test("replaces e with Math.E", () => {
    expect(normalizeExpression("e")).toBe("Math.E");
  });

  test("replaces pi with Math.PI", () => {
    expect(normalizeExpression("pi")).toBe("Math.PI");
  });

  test("does not replace sinh()", () => {
    expect(normalizeExpression("sinh(1)")).toBe("sinh(1)");
  });

  test("does not replace asinh()", () => {
    expect(normalizeExpression("asinh(1)")).toBe("asinh(1)");
  });

  test("handles multiple replacements", () => {
    expect(normalizeExpression("sin(pi)")).toBe("sinDeg(Math.PI)");
  });
});
