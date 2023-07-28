#!/usr/bin/env bash

event_id=$1

curl -s 'https://eu-offering.kambicdn.org/offering/v2018/ubbe/betoffer/event/'"${event_id}"'.json?lang=nl_BE&market=BE&client_id=2&channel_id=1&ncid=1628348100620&includeParticipants=true' \
  -H 'Connection: keep-alive' \
  -H 'sec-ch-ua: "Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36' \
  -H 'Origin: https://nl-sports.unibet.be' \
  -H 'Sec-Fetch-Site: cross-site' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Referer: https://nl-sports.unibet.be/' \
  -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
  --compressed \
  | jq --raw-output '.betOffers[] | .criterion.id as $id | .eventId as $event_id | (.outcomes[] | select (.odds != null) | [$id, $event_id, "ubbe", .label, .odds?/1000, (.line // 0) / 1000] | @csv)'
