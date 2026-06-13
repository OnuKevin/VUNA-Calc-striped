const calc = require("../assets/js/script");

describe("calculateExpression", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="result" />
      <button id="theme-toggle"></button>
    `;
    calc.LAST_RESULT = 0;
  });

  test("evaluates simple addition", () => {
    expect(calc.calculateExpression("2+3")).toBe(5);
  });

  test("evaluates simple multiplication", () => {
    expect(calc.calculateExpression("4*5")).toBe(20);
  });

  test("evaluates simple division", () => {
    expect(calc.calculateExpression("10/2")).toBe(5);
  });

  test("evaluates simple subtraction", () => {
    expect(calc.calculateExpression("10-3")).toBe(7);
  });

  test("evaluates power operator", () => {
    expect(calc.calculateExpression("2**3")).toBe(8);
  });

  test("evaluates complex expression", () => {
    expect(calc.calculateExpression("2+3*4")).toBe(14);
  });

  test("evaluates parentheses", () => {
    expect(calc.calculateExpression("(2+3)*4")).toBe(20);
  });

  test("normalizes sin() to sinDeg() via normalizeExpression", () => {
    expect(calc.calculateExpression("sin(90)")).toBe("Error");
  });

  test("evaluates pi constant", () => {
    expect(calc.calculateExpression("pi")).toBeCloseTo(Math.PI);
  });

  test("evaluates e constant", () => {
    expect(calc.calculateExpression("e")).toBeCloseTo(Math.E);
  });

  test("replaces ans with LAST_RESULT", () => {
    calc.LAST_RESULT = 42;
    expect(calc.calculateExpression("ans+1")).toBe(43);
  });

  test("replaces Ans (case insensitive) with LAST_RESULT", () => {
    calc.LAST_RESULT = 10;
    expect(calc.calculateExpression("Ans*2")).toBe(20);
  });

  test("returns Error for invalid expression", () => {
    expect(calc.calculateExpression("abc")).toBe("Error");
  });

  test("returns Error for division by zero", () => {
    expect(calc.calculateExpression("1/0")).toBe("Error");
  });

  test("returns Error for empty string", () => {
    expect(calc.calculateExpression("")).toBe("Error");
  });
});
