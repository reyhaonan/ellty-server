export class Calculator {
  static calculate(
    operation: string,
    operand1: number,
    operand2: number
  ): number {
    switch (operation) {
      case "add":
        return operand1 + operand2;
      case "sub":
        return operand1 - operand2;
      case "mul":
        return operand1 * operand2;
      case "div":
        if (operand2 === 0) {
          throw new Error("Division by zero");
        }
        return operand1 / operand2;
      default:
        throw new Error("Invalid operation");
    }
  }
}
