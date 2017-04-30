/**
 * Code for regression extracted from jqplot.trendline.js
 *
 * Version: 1.0.0a_r701
 *
 * Copyright (c) 2009-2011 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can
 * choose the license that best suits your project and use it accordingly.
 *
 **/

function regression(x, y, typ) {
    const type = (typ === null) ? 'linear' : typ;
    let N = x.length;
    let slope;
    let intercept;
    let SX = 0;
    let SY = 0;
    let SXX = 0;
    let SXY = 0;
    let SYY = 0;
    let Y = [];
    let X = [];

    if (type === 'linear') {
        X = x;
        Y = y;
    }
    else if (type === 'exp' || type === 'exponential') {
        for (let i = 0; i < y.length; i++) {
            // ignore points <= 0, log undefined.
            if (y[i] <= 0) {
                N--;
            }
            else {
                X.push(x[i]);
                Y.push(Math.log(y[i]));
            }
        }
    }

    for (let i = 0; i < N; i++) {
        SX = SX + X[i];
        SY = SY + Y[i];
        SXY = SXY + X[i] * Y[i];
        SXX = SXX + X[i] * X[i];
        SYY = SYY + Y[i] * Y[i];
    }

    slope = (N * SXY - SX * SY) / (N * SXX - SX * SX);
    intercept = (SY - slope * SX) / N;

    return [slope, intercept];
}

function linearRegression(X, Y) {
    const ret = regression(X, Y, 'linear');
    return [ret[0], ret[1]];
}

function expRegression(X, Y) {
    let ret = regression(X, Y, 'exp');
    const base = Math.exp(ret[0]);
    const coeff = Math.exp(ret[1]);
    return [base, coeff];
}

/*
 TODO: this function is quite inefficient.
 Refactor it if there is problem with speed.
 */
function fitData(data, type = 'linear') {
    const x = [];
    const y = [];
    const ypred = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i] && Object.prototype.toString.call(data[i]) === '[object Array]') {
            if (data[i] && data[i][0] && data[i][1]) {
                x.push(data[i][0]);
                y.push(data[i][1]);
            }
        }
        else if (data[i] && typeof data[i] === 'number') {//If type of X axis is category
            x.push(i);
            y.push(data[i]);
        }
        else if (data[i] && Object.prototype.toString.call(data[i]) === '[object Object]') {
            if (data[i] && data[i].x && data[i].y) {
                x.push(data[i].x);
                y.push(data[i].y);
            }
        }
    }

    if (type === 'linear') {

        let ret = linearRegression(x, y);
        for (let i = 0; i < x.length; i++) {
            let res = ret[0] * x[i] + ret[1];
            ypred.push([x[i], res]);
        }

        return {
            data: ypred,
            slope: ret[0],
            intercept: ret[1],
            y: function (x) {
                return (this.slope * x) + this.intercept;
            },
            x: function (y) {
                return (y - this.intercept) / this.slope;
            }
        };
    }
    if (type === 'exp' || type === 'exponential') {

        let ret = expRegression(x, y);
        for (let i = 0; i < x.length; i++) {
            let res = ret[1] * Math.pow(ret[0], x[i]);
            ypred.push([x[i], res]);
        }
        ypred.sort();

        return {
            data: ypred,
            base: ret[0],
            coeff: ret[1]
        };
    }
    throw new Error(`Type ${type} is not supported by the regression module`);
}

module.exports = {
    regression,
    linearRegression,
    expRegression,
    fitData
};
