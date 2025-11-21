export default {
  extends: ["stylelint-config-standard-scss"],
  customSyntax: "postcss-scss",
  rules: {
    "block-no-empty": true,
    "color-no-invalid-hex": true,
    "no-descending-specificity": null,
    "scss/at-extend-no-missing-placeholder": null,
    "property-no-vendor-prefix": null
  }
};
