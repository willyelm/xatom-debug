'use babel'
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { EventEmitter }  from 'events'

export interface Expression {
  text: string,
  element: any
}

export type Expressions = Array<Expression>

export class ExpressionManager {

  private expressions: Expressions = []

  constructor () {}

  public getExpressions (): Expressions {
    return this.expressions
  }

  // getExpressionsFromFile(filePath: String): Expressions {
  //   return this.expressions.filter((item) => {
  //     return (item.filePath === filePath)
  //   })
  // }

  removeExpression (Expression: Expression): Promise<boolean> {
    return new Promise ((resolve, reject) => {
      let index = this.expressions.indexOf(Expression)
      if(index != -1) {
        // if (expression.marker) Expression.marker.destroy()
      	// this.expressions.splice(index, 1)
        return resolve(true)
      }
      return reject('Expression does not exists')
    })
  }

  addExpression (text: string, element: any): Promise<Expression> {
    return new Promise((resolve, reject) => {
      let expression = {
        text,
        element
      } as Expression
      let index = this.expressions.push(expression)
      if (index > -1) {
        resolve(expression)
      } else {
        reject('Unable to add Expression')
      }
    })
  }
}
