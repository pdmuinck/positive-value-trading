export class SportRadarScraper {
    static getEventUrl(id: number): string {
        return "https://lsc.fn.sportradar.com/sportradar/en/Europe:Berlin/gismo/match_info/" + id
    }
}