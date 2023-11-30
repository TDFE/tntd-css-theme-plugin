const { generateCssVar, getColorValue } = require('./utils/index.js');
const { generate } = require('@ant-design/colors');

const functions = (defaultVar) => ({
    fade: (color, alpha) => {
        if (color.name === 'var') {
            const value = color.args[0].value;
            if (value) {
                if(defaultVar) {
                    generateCssVar({ attr: value, key: `${value}-fade`, type: 'toRgb', unit: alpha.value, defaultVar });
                }
                return `rgba(var(${value}-fade), ${alpha.value / 100})`;
            }
        }
        return getColorValue(color, alpha, 'fade');
    },
    tint: (color, alpha) => {
        if (color.name === 'var') {
            const value = color.args[0].value;

            if (value) {
                if(defaultVar) {
                    generateCssVar({ attr: value, key: `${value}-tint-${alpha.value}`, type: 'tint', unit: alpha.value, defaultVar });
                }
                return `var(${value}-tint-${alpha.value})`;
            }
        }
        return getColorValue(color, alpha, 'tint');
    },
    shade: (color, alpha) => {
        if (color.name === 'var') {
            const value = color.args[0].value;

            if (value) {
                if(defaultVar) {
                    generateCssVar({ attr: value, key: `${value}-shade-${alpha.value}`, type: 'shade', unit: alpha.value, defaultVar });
                }
                return `var(${value}-shade-${alpha.value})`;
            }
        }
        return getColorValue(color, alpha, 'shade');
    },
    darken: (color, alpha) => {
        if (color.name === 'var') {
            const value = color.args[0].value;

            if (value) {
                if(defaultVar) {
                    generateCssVar({ attr: value, key: `${value}-darken-${alpha.value}`, type: 'darken', unit: alpha.value, defaultVar });
                }
                return `var(${value}-darken-${alpha.value})`;
            }
        }
        return getColorValue(color, alpha, 'darken');
    },
    color: (color, alpha) => {
        // 如果是css变量的方式
        if(color.value.startsWith('--')) {
            return `var(${color.value})`;
        }
        return color;
    }
});

class FunctionOverridePlugin {
    constructor(defaultVar) {
        let initVar = ''
        if(defaultVar) {
            initVar = ':root {\n'

            for(let i in defaultVar) {
                // 生成10个色系
                const list = generate(defaultVar[i]);
                list.forEach((el, index) => {
                    initVar = initVar + `    --${i}-${index + 1}: ${el};` + '\n'
                })
            }
            initVar = initVar + '}'
        }
        
        this.defaultVar = initVar;
    }
    install(less) {
        less.functions.functionRegistry.addMultiple(functions(this.defaultVar));
    }
}

module.exports = FunctionOverridePlugin
