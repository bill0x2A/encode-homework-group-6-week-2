// eslint-disable-next-line node/no-missing-import
import { deployNewTokenContract } from "./deployment";

deployNewTokenContract().catch((e) => {
  console.log(e);
});
