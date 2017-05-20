'use babel';
export class ExpressionManager {
    constructor() {
        this.expressions = [];
    }
    getExpressions() {
        return this.expressions;
    }
    // getExpressionsFromFile(filePath: String): Expressions {
    //   return this.expressions.filter((item) => {
    //     return (item.filePath === filePath)
    //   })
    // }
    removeExpression(Expression) {
        return new Promise((resolve, reject) => {
            let index = this.expressions.indexOf(Expression);
            if (index != -1) {
                // if (expression.marker) Expression.marker.destroy()
                // this.expressions.splice(index, 1)
                return resolve(true);
            }
            return reject('Expression does not exists');
        });
    }
    addExpression(text, element) {
        return new Promise((resolve, reject) => {
            let expression = {
                text,
                element
            };
            let index = this.expressions.push(expression);
            if (index > -1) {
                resolve(expression);
            }
            else {
                reject('Unable to add Expression');
            }
        });
    }
}
//# sourceMappingURL=expression-manager.js.map