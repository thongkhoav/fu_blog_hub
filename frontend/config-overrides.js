// import { override, useBabelRc } from "customize-cra";

// // eslint-disable-next-line react-hooks/rules-of-hooks
// export default override(useBabelRc());

const { override, useBabelRc } = require("customize-cra");

// eslint-disable-next-line react-hooks/rules-of-hooks
module.exports = override(useBabelRc());
