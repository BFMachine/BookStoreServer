let scrapeAndFill = require("../modules/fillDB");

let stopFlag;
// /api/scrape/100 - number of book in every category
exports.scrape = async (req, res) => { 

    if(stopFlag) {
        console.error("process still work, wait...");
        return res.send("process still work, wait...");
    } else {
        stopFlag = true;
    }

    const options = {
        number : req.params.number,
        visible: !!req.params.visible // ? true : false
    };

    try {
        await scrapeAndFill.fill(options);
        stopFlag = undefined;
        console.error("All data loaded successed, I think");
        return res.send("All data loaded successed, I think");
    }
	catch(err) {
        stopFlag = undefined;
		console.error(err);
		return res.status(500).send("Error scrape file");
	}
};
