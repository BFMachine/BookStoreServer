module.exports = {
    "extends": [
        "airbnb",
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "env": {
        "browser": true,
    },
    "parser": "babel-eslint",
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "eol-last": ["error", "always"],
        "semi": ["error", "always"],
        "global-require": "off",
        "no-console": "off",
        "import/no-extraneous-dependencies": "off",
        "import/extensions": "off",
        "import/no-unresolved": "off",
        "jsx-a11y/anchor-is-valid": "off",
        "no-underscore-dangle": "off",
        "prefer-promise-reject-errors": "off",
        "no-nested-ternary": "off",
        "react/no-multi-comp": "off",
        "react/no-unescaped-entities": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "no-constant-condition": "off",
        "react/destructuring-assignment": "off",
    },
};