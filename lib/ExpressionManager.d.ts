export interface Expression {
    text: string;
    element: any;
}
export declare type Expressions = Array<Expression>;
export declare class ExpressionManager {
    private expressions;
    constructor();
    getExpressions(): Expressions;
    removeExpression(Expression: Expression): Promise<boolean>;
    addExpression(text: string, element: any): Promise<Expression>;
}
