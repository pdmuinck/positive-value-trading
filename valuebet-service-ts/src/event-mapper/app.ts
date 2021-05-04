import {EventInfo} from "../service/events";
import {Scraper} from "../client/scraper";

exports.handler = async function getEvents() {
    const events: EventInfo[] = await Scraper.getEventsForLeague()
}



