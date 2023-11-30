/**
 * 动态生成cssVar.css
 */
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const lessFuns = require('tntd-theme-less');

module.exports = {
    // 生成css变量，使用fade(@primary, 30%)这种场景
    generateCssVar: function ({ attr, key, type, unit, defaultVar }) {
        const cssVarpath = path.resolve(process.cwd(), './src/cssVar.css');

        let css;
        if (!fs.existsSync(cssVarpath)) {
            fs.writeFileSync(cssVarpath, defaultVar);
            css = defaultVar;
        } else {
            css = fs.readFileSync(cssVarpath, 'utf-8');
        }

        const root = postcss.parse(css);
        // root节点属性
        const rootRule = root.nodes.find((node) => node.type === 'rule' && node.selector === ':root');
        // 判断属性是否存在
        const bool = rootRule.nodes.find((node) => node.type === 'decl' && node.prop === key);

        if (!bool) {
            const { value } = rootRule.nodes.find((node) => node.type === 'decl' && node.prop === attr) || {};

            const color = new lessFuns.Color(value.replace('#', ''));
            const amount = new lessFuns.Dimension(unit);
            let propValue;
            if (type === 'toRgb') {
                propValue = color.rgb.join(',');
            } else {
                propValue = lessFuns[type](color, amount).toCSS();
            }

            root.walkRules(':root', (rule) => {
                rule.append({ prop: key, value: propValue });
            });

            fs.writeFileSync(cssVarpath, root.toString(), 'utf-8');
        }
    },
    // 获取颜色
    getColorValue: function (color, alpha, type) {
        if (color.type === 'Anonymous') {
            if (color.value.includes('rgba')) {
                const rgba = color.value;
                const [r, g, b, a] = rgba.match(/\d+(\.\d+)?/g);
                color = new lessFuns.Color([r, g, b], Number(a));
            } else if (color.value.includes('#')) {
                color = new lessFuns.Color(color.value.replace('#', ''));
            } else {
                throw Error(`当前颜色转换失败,type: ${type} color:${color}`);
            }
        }
        return lessFuns[type](color, alpha).toCSS();
    }
};
