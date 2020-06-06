import { pushLog } from "./../../actions";
import store from "./../../store";
import { Logger } from "./logger";

new Logger(store, {push : pushLog})


