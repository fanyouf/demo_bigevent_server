module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
   
    // "parserOptions": {
    //     "ecmaVersion": 2018,
    //     "sourceType": "module"
    // },
    "rules": {
        // 不使用; 如果使用就报错
        semi: ["error", "never"],
        // 不强制使用驼峰命令名
        camelcase:["off"],
        "no-multiple-empty-lines":["error"],
        "indent": ["error", 4 ],
        "quotes": ["error", "single"],
        "no-var": "error",
        "no-irregular-whitespace": 2,
        "key-spacing": ["error", { "beforeColon": false, "afterColon": true }]//对象字面量中冒号的前后空格
    }
};