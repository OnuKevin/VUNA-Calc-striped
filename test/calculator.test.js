const calc = require("../assets/js/script");

describe("Calculator UI functions", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <input type="text" id="result" />
      <button id="theme-toggle"></button>
    `;
    document.body.classList.remove("dark-mode");
    calc.currentExpression = "";
    calc.LAST_RESULT = 0;
  });

  describe("appendToResult", () => {
    test("appends number to expression", () => {
      calc.appendToResult(5);
      expect(calc.currentExpression).toBe("5");
    });

    test("appends multiple numbers", () => {
      calc.appendToResult(1);
      calc.appendToResult(2);
      calc.appendToResult(3);
      expect(calc.currentExpression).toBe("123");
    });

    test("appends decimal point", () => {
      calc.appendToResult(1);
      calc.appendToResult(".");
      calc.appendToResult(5);
      expect(calc.currentExpression).toBe("1.5");
    });

    test("updates display", () => {
      calc.appendToResult(7);
      expect(document.getElementById("result").value).toBe("7");
    });
  });

  describe("bracketToResult", () => {
    test("appends opening bracket", () => {
      calc.bracketToResult("(");
      expect(calc.currentExpression).toBe("(");
    });

    test("appends closing bracket", () => {
      calc.bracketToResult("(");
      calc.bracketToResult(")");
      expect(calc.currentExpression).toBe("()");
    });
  });

  describe("backspace", () => {
    test("removes last character", () => {
      calc.currentExpression = "123";
      calc.backspace();
      expect(calc.currentExpression).toBe("12");
    });

    test("removes to empty string", () => {
      calc.currentExpression = "1";
      calc.backspace();
      expect(calc.currentExpression).toBe("");
    });

    test("does nothing on empty expression", () => {
      calc.currentExpression = "";
      calc.backspace();
      expect(calc.currentExpression).toBe("");
    });
  });

  describe("operatorToResult", () => {
    test("appends + operator", () => {
      calc.operatorToResult("+");
      expect(calc.currentExpression).toBe("+");
    });

    test("appends - operator", () => {
      calc.operatorToResult("-");
      expect(calc.currentExpression).toBe("-");
    });

    test("appends * operator", () => {
      calc.operatorToResult("*");
      expect(calc.currentExpression).toBe("*");
    });

    test("appends / operator", () => {
      calc.operatorToResult("/");
      expect(calc.currentExpression).toBe("/");
    });

    test("converts ^ to **", () => {
      calc.operatorToResult("^");
      expect(calc.currentExpression).toBe("**");
    });
  });

  describe("clearResult", () => {
    test("clears expression", () => {
      calc.currentExpression = "123+456";
      calc.clearResult();
      expect(calc.currentExpression).toBe("");
    });

    test("displays 0 when cleared", () => {
      calc.currentExpression = "123";
      calc.clearResult();
      expect(document.getElementById("result").value).toBe("0");
    });
  });

  describe("updateResult", () => {
    test("displays current expression", () => {
      calc.currentExpression = "42";
      calc.updateResult();
      expect(document.getElementById("result").value).toBe("42");
    });

    test("displays 0 when expression is empty", () => {
      calc.currentExpression = "";
      calc.updateResult();
      expect(document.getElementById("result").value).toBe("0");
    });
  });

  describe("toggleTheme", () => {
    test("toggles dark mode class on body", () => {
      calc.toggleTheme();
      expect(document.body.classList.contains("dark-mode")).toBe(true);
    });

    test("toggles back to light mode", () => {
      calc.toggleTheme();
      calc.toggleTheme();
      expect(document.body.classList.contains("dark-mode")).toBe(false);
    });

    test("updates button text to sun icon in dark mode", () => {
      calc.toggleTheme();
      expect(document.getElementById("theme-toggle").innerHTML).toBe("☀️");
    });

    test("updates button text to moon icon in light mode", () => {
      calc.toggleTheme();
      calc.toggleTheme();
      expect(document.getElementById("theme-toggle").innerHTML).toBe("🌙");
    });

    test("persists theme to localStorage", () => {
      calc.toggleTheme();
      expect(localStorage.getItem("theme")).toBe("dark");
    });

    test("persists light theme to localStorage", () => {
      calc.toggleTheme();
      calc.toggleTheme();
      expect(localStorage.getItem("theme")).toBe("light");
    });
  });

  describe("calculateResult", () => {
    test("calculates and displays result", () => {
      calc.currentExpression = "2+3";
      calc.calculateResult();
      expect(document.getElementById("result").value).toBe("5");
    });

    test("updates LAST_RESULT", () => {
      calc.currentExpression = "10*2";
      calc.calculateResult();
      expect(calc.LAST_RESULT).toBe("20");
    });

    test("does nothing on empty expression", () => {
      calc.currentExpression = "";
      calc.calculateResult();
      expect(calc.currentExpression).toBe("");
    });

    test("stores result for next calculation", () => {
      calc.currentExpression = "5+5";
      calc.calculateResult();
      calc.currentExpression = "ans+1";
      calc.calculateResult();
      expect(document.getElementById("result").value).toBe("11");
    });
  });
});
