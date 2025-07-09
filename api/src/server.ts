/** @format */

import app from "./app";
import config from "./config/env";

app.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`);
}).on("error", (err: Error) => {
	console.error("Server failed to start:", err);
});
