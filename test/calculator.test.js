const { calculateExpression, normalizeExpression } = global;

// Normalize expression tests
describe("normalizeExpression", () => {
  test("replaces 'e' with Math.E", () => {
    expect(normalizeExpression("e")).toBe("Math.E");
  });

  test("replaces 'pi' with Math.PI", () => {
    expect(normalizeExpression("pi")).toBe("Math.PI");
  });

  test("replaces sin( with sinDeg(", () => {
    expect(normalizeExpression("sin(0)")).toBe("sinDeg(0)");
  });

  test("replaces cos( with cosDeg(", () => {
    expect(normalizeExpression("cos(0)")).toBe("cosDeg(0)");
  });

  test("replaces tan( with tanDeg(", () => {
    expect(normalizeExpression("tan(0)")).toBe("tanDeg(0)");
  });

  test("replaces asin( with asinDeg(", () => {
    expect(normalizeExpression("asin(0)")).toBe("asinDeg(0)");
  });

  test("replaces acos( with acosDeg(", () => {
    expect(normalizeExpression("acos(0)")).toBe("acosDeg(0)");
  });

  test("replaces atan( with atanDeg(", () => {
    expect(normalizeExpression("atan(0)")).toBe("atanDeg(0)");
  });

  test("leaves sinh( unchanged", () => {
    expect(normalizeExpression("sinh(0)")).toBe("sinh(0)");
  });

  test("leaves asinh( unchanged", () => {
    expect(normalizeExpression("asinh(0)")).toBe("asinh(0)");
  });

  test("handles mixed expression", () => {
    const result = normalizeExpression("sin(pi/2)+cos(0)");
    expect(result).toBe("sinDeg(Math.PI/2)+cosDeg(0)");
  });
});

// Calculate expression tests
describe("calculateExpression", () => {
  beforeEach(() => {
    global.LAST_RESULT = 0;
  });

  test("adds two numbers", () => {
    expect(calculateExpression("2+3")).toBe(5);
  });

  test("subtracts two numbers", () => {
    expect(calculateExpression("10-4")).toBe(6);
  });

  test("multiplies two numbers", () => {
    expect(calculateExpression("6*7")).toBe(42);
  });

  test("divides two numbers", () => {
    expect(calculateExpression("12/4")).toBe(3);
  });

  test("respects order of operations", () => {
    expect(calculateExpression("2+3*4")).toBe(14);
  });

  test("handles parentheses", () => {
    expect(calculateExpression("(2+3)*4")).toBe(20);
  });

  test("handles decimal numbers", () => {
    expect(calculateExpression("3.5+2.5")).toBe(6);
  });

  test("handles power operator", () => {
    expect(calculateExpression("2**3")).toBe(8);
  });

  test("handles modulus", () => {
    expect(calculateExpression("10%3")).toBe(1);
  });

  test("replaces 'ans' with LAST_RESULT", () => {
    global.LAST_RESULT = 5;
    expect(calculateExpression("ans+3")).toBe(8);
  });

  test("replaces 'ANS' case-insensitively", () => {
    global.LAST_RESULT = 10;
    expect(calculateExpression("ANS/2")).toBe(5);
  });

  test("returns 'Error' for division by zero", () => {
    expect(calculateExpression("1/0")).toBe("Error");
  });

  test("returns 'Error' for invalid expressions", () => {
    expect(calculateExpression("2++2")).toBe("Error");
  });

  test("evaluates expression with pi", () => {
    const result = calculateExpression("pi*2");
    expect(result).toBeCloseTo(Math.PI * 2, 10);
  });

  test("evaluates expression with e", () => {
    const result = calculateExpression("e");
    expect(result).toBe(Math.E);
  });
});

// Matrix operation tests
describe("matrix operations", () => {
  test("matrixAdd adds two matrices", () => {
    const A = [[1,2],[3,4]];
    const B = [[5,6],[7,8]];
    expect(matrixAdd(A, B)).toEqual([[6,8],[10,12]]);
  });

  test("matrixSubtract subtracts two matrices", () => {
    const A = [[5,6],[7,8]];
    const B = [[1,2],[3,4]];
    expect(matrixSubtract(A, B)).toEqual([[4,4],[4,4]]);
  });

  test("matrixMultiply multiplies two matrices", () => {
    const A = [[1,2],[3,4]];
    const B = [[2,0],[1,2]];
    expect(matrixMultiply(A, B)).toEqual([[4,4],[10,8]]);
  });

  test("matrixScale scales a matrix", () => {
    const A = [[1,2],[3,4]];
    expect(matrixScale(A, 3)).toEqual([[3,6],[9,12]]);
  });

  test("matrixDeterminant of 2x2", () => {
    const A = [[1,2],[3,4]];
    expect(matrixDeterminant(A)).toBe(-2);
  });

  test("matrixDeterminant of 3x3", () => {
    const A = [[6,1,1],[4,-2,5],[2,8,7]];
    expect(matrixDeterminant(A)).toBe(-306);
  });

  test("matrixDeterminant of 1x1", () => {
    expect(matrixDeterminant([[5]])).toBe(5);
  });

  test("matrixTranspose", () => {
    const A = [[1,2,3],[4,5,6]];
    expect(matrixTranspose(A)).toEqual([[1,4],[2,5],[3,6]]);
  });

  test("matrixInverse of 2x2", () => {
    const A = [[4,7],[2,6]];
    const inv = matrixInverse(A);
    const product = matrixMultiply(A, inv);
    expect(product[0][0]).toBeCloseTo(1, 10);
    expect(product[1][1]).toBeCloseTo(1, 10);
    expect(product[0][1]).toBeCloseTo(0, 10);
    expect(product[1][0]).toBeCloseTo(0, 10);
  });

  test("matrixInverse returns null for singular matrix", () => {
    const A = [[1,2],[2,4]];
    expect(matrixInverse(A)).toBeNull();
  });
});
