import { checkToken } from "../../lib/csrf";

const handler = (req, res) => {
	console.log(req.headers);
	// just add this line to the top of your handler
	if (!checkToken(req)) return res.status(401).send();

	// your API logic here...
	res.status(200).json({ name: "John Doe" });
};

export default handler;
